"""
AI Service — HuggingFace Inference API wrapper.
Uses free-tier models. No paid API needed.
"""

import os
import httpx
from typing import Optional

HF_API_KEY = os.getenv("HUGGINGFACE_API_KEY", "")
HF_BASE = "https://api-inference.huggingface.co/models"

# Free models ranked by chemistry knowledge
CHEMISTRY_MODELS = [
    "mistralai/Mistral-7B-Instruct-v0.3",   # Best for chemistry
    "HuggingFaceH4/zephyr-7b-beta",          # Good alternative
    "meta-llama/Llama-2-7b-chat-hf",         # Fallback
]

SYSTEM_PROMPT = """You are a helpful and knowledgeable chemistry AI assistant specializing in:
- Molecular structures and properties
- Drug discovery and medicinal chemistry
- Chemical reactions and mechanisms
- Organic and inorganic chemistry
- Biochemistry and pharmacology

Provide accurate, scientific, and educational responses.
When mentioning molecules, include their SMILES notation when helpful.
Keep responses concise and well-structured."""


def build_prompt(user_message: str, system: str = SYSTEM_PROMPT) -> str:
    return f"<s>[INST] {system}\n\n{user_message} [/INST]"


async def generate_text(
    prompt: str,
    max_tokens: int = 512,
    temperature: float = 0.7,
    model_index: int = 0,
) -> dict:
    """Call HuggingFace inference API."""
    model = CHEMISTRY_MODELS[model_index % len(CHEMISTRY_MODELS)]
    url = f"{HF_BASE}/{model}"

    async with httpx.AsyncClient(timeout=90.0) as client:
        response = await client.post(
            url,
            headers={
                "Authorization": f"Bearer {HF_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "inputs": build_prompt(prompt),
                "parameters": {
                    "max_new_tokens": max_tokens,
                    "temperature": temperature,
                    "top_p": 0.9,
                    "repetition_penalty": 1.1,
                    "return_full_text": False,
                },
            },
        )

        if response.status_code == 503:
            return {"error": "model_loading", "message": "Model is loading, retry in 20s"}

        if response.status_code == 429:
            return {"error": "rate_limit", "message": "Rate limit reached. Try again later."}

        data = response.json()

        if isinstance(data, list) and data[0].get("generated_text"):
            text = data[0]["generated_text"]
            # Strip instruction tags if full text returned
            idx = text.rfind("[/INST]")
            if idx != -1:
                text = text[idx + 7:].strip()
            return {"text": text, "model": model}

        if isinstance(data, dict) and data.get("error"):
            return {"error": data["error"], "message": str(data.get("error"))}

        return {"error": "unknown", "message": "Unexpected response format"}


async def analyze_molecule(smiles: str) -> dict:
    """Use AI to analyze a molecule from its SMILES."""
    prompt = f"""Analyze this molecule with SMILES: {smiles}

Provide:
1. Common name (if known)
2. Molecular class/category
3. Key structural features
4. Potential biological activity
5. Drug-likeness assessment (Lipinski)

Keep it concise and scientific."""

    return await generate_text(prompt, max_tokens=400)


async def predict_reaction(reactant_a: str, reactant_b: str, conditions: str = "") -> dict:
    """Predict the product of a chemical reaction."""
    prompt = f"""Predict the product of this chemical reaction:
Reactant A: {reactant_a}
Reactant B: {reactant_b}
Conditions: {conditions or "standard conditions"}

Provide: main product (with SMILES), reaction type, mechanism summary, yield estimate."""

    return await generate_text(prompt, max_tokens=500)
