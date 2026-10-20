import os
import uuid
import httpx
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from pydantic import BaseModel
from typing import Optional
from database import get_db

router = APIRouter()

class ExperimentCreate(BaseModel):
    user_id: Optional[str] = "guest"
    type: str
    inputs: dict

@router.post("")
async def run_experiment(data: ExperimentCreate, db: AsyncSession = Depends(get_db)):
    groq_key = os.getenv("GROQ_API_KEY", "")
    
    # Build prompt based on experiment type
    if data.type == "reaction_prediction":
        prompt = f"""Predict the chemical reaction products:
Reactant A: {data.inputs.get('reactantA', '')}
Reactant B: {data.inputs.get('reactantB', '')}
Conditions: {data.inputs.get('conditions', 'standard')}
Provide: products, mechanism, and yield estimate."""

    elif data.type == "toxicity":
        prompt = f"""Analyze toxicity of: {data.inputs.get('molecule', '')}
Using Lipinski Rule of Five, provide:
- MW, LogP, HBD, HBA values
- Toxicity risk assessment
- Safety recommendations"""

    elif data.type == "similarity":
        prompt = f"""Find and describe molecules similar to: {data.inputs.get('query', '')}
List 5 structurally similar molecules with:
- Name, SMILES, similarity reason"""

    elif data.type == "drug_analysis":
        prompt = f"""Analyze drug-likeness of SMILES: {data.inputs.get('smiles', '')}
Apply Lipinski Rule of Five:
- Calculate MW, LogP, HBD, HBA
- Drug-likeness score
- ADMET predictions"""
    else:
        prompt = f"Analyze this chemistry experiment: {data.inputs}"

    result = ""
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {groq_key}", "Content-Type": "application/json"},
                json={
                    "model": "openai/gpt-oss-20b",
                    "messages": [
                        {"role": "system", "content": "You are an expert chemistry AI assistant."},
                        {"role": "user", "content": prompt}
                    ],
                    "max_tokens": 1024,
                }
            )
            res = response.json()
            result = res["choices"][0]["message"]["content"]
    except Exception as e:
        result = f"Error: {str(e)}"

    # Save to DB
    try:
        exp_id = str(uuid.uuid4())
        await db.execute(
            text("""INSERT INTO experiments (id, user_id, type, title, inputs, results, status)
                    VALUES (:id, :uid, :type, :title, :inputs, :results, :status)"""),
            {
                "id": exp_id,
                "uid": data.user_id,
                "type": data.type,
                "title": data.type.replace("_", " ").title(),
                "inputs": str(data.inputs),
                "results": result[:500],
                "status": "completed",
            }
        )
        await db.commit()
    except Exception as e:
        print(f"Experiment save error: {e}")

    return {"result": result}

@router.get("")
async def get_experiments(user_id: str, db: AsyncSession = Depends(get_db)):
    try:
        res = await db.execute(
            text("SELECT id, type, title, status, created_at FROM experiments WHERE user_id = :uid ORDER BY created_at DESC"),
            {"uid": user_id}
        )
        rows = res.fetchall()
        return [{"id": r[0], "type": r[1], "title": r[2], "status": r[3], "createdAt": str(r[4])} for r in rows]
    except Exception as e:
        return []
        