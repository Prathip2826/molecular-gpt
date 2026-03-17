import os
import httpx
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Dict
from database import get_db
from models.models import Experiment

router = APIRouter()
HF_API_KEY = os.getenv("HUGGINGFACE_API_KEY", "")
HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.3"

EXPERIMENT_PROMPTS = {
    "reaction_prediction": lambda inp: f"""As a chemistry expert, predict the main product(s) of this reaction:
Reactant A: {inp.get('reactantA', 'Unknown')}
Reactant B: {inp.get('reactantB', 'Unknown')}
Conditions: {inp.get('conditions', 'Standard')}
Provide: product SMILES, mechanism summary, yield estimate, side products.""",

    "toxicity": lambda inp: f"""As a toxicologist, evaluate toxicity of: {inp.get('molecule', 'Unknown')}
Provide: LD50 estimate, toxic effects, safety classification, max safe dose.""",

    "similarity": lambda inp: f"""As a cheminformatics expert, list 5 molecules similar to {inp.get('query', 'Unknown')}.
Include names, SMILES, structural similarities, and shared pharmacophores.""",

    "drug_analysis": lambda inp: f"""Analyze drug-likeness of SMILES: {inp.get('smiles', 'CC(=O)Oc1ccccc1C(=O)O')}
Apply Lipinski Rule of Five. Provide: MW, LogP, H-bond donors/acceptors, bioavailability score.""",
}

class ExperimentRun(BaseModel):
    type: str
    inputs: Dict[str, str]
    user_id: str = "anonymous"

async def call_hf(prompt: str) -> str:
    formatted = f"<s>[INST] {prompt} [/INST]"
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(
                f"https://api-inference.huggingface.co/models/{HF_MODEL}",
                headers={"Authorization": f"Bearer {HF_API_KEY}"},
                json={"inputs": formatted, "parameters": {"max_new_tokens": 400, "temperature": 0.6}}
            )
            data = resp.json()
            if isinstance(data, list) and data[0].get("generated_text"):
                text = data[0]["generated_text"]
                idx = text.rfind("[/INST]")
                return text[idx + 7:].strip() if idx != -1 else text
            return "Model warming up. Try again in 20 seconds."
    except Exception as e:
        return f"Error: {str(e)}"

@router.post("/run")
async def run_experiment(data: ExperimentRun, db: AsyncSession = Depends(get_db)):
    prompt_fn = EXPERIMENT_PROMPTS.get(data.type)
    if not prompt_fn:
        return {"error": f"Unknown experiment type: {data.type}"}

    prompt = prompt_fn(data.inputs)
    result_text = await call_hf(prompt)

    exp = Experiment(
        user_id=data.user_id,
        type=data.type,
        title=f"{data.type.replace('_', ' ').title()} - {list(data.inputs.values())[0] if data.inputs else 'Analysis'}",
        inputs=data.inputs,
        results={"text": result_text},
        status="completed",
    )
    db.add(exp)
    await db.commit()

    return {"result": result_text, "experiment_id": exp.id}

@router.get("")
async def get_experiments(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Experiment).where(Experiment.user_id == user_id).order_by(Experiment.created_at.desc())
    )
    exps = result.scalars().all()
    return [{"id": e.id, "type": e.type, "title": e.title, "status": e.status, "createdAt": str(e.created_at)} for e in exps]
