from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from pydantic import BaseModel
from typing import Optional, List
import uuid, json
from database import get_db

router = APIRouter()

class MoleculeCreate(BaseModel):
    user_id: str
    name: str
    formula: Optional[str] = None
    smiles: str
    description: Optional[str] = None
    properties: dict = {}
    tags: List[str] = []

@router.get("")
async def get_molecules(user_id: str, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(
            text("SELECT id, name, formula, smiles, tags, created_at FROM molecules WHERE user_id = :uid ORDER BY created_at DESC"),
            {"uid": user_id}
        )
        rows = result.fetchall()
        return [{"id": r[0], "name": r[1], "formula": r[2], "smiles": r[3], "tags": r[4], "createdAt": str(r[5])} for r in rows]
    except Exception as e:
        print(f"Get molecules error: {e}")
        return []

@router.post("")
async def create_molecule(data: MoleculeCreate, db: AsyncSession = Depends(get_db)):
    try:
        mol_id = str(uuid.uuid4())
        # Use ORM instead of raw SQL
        from models.models import Molecule
        mol = Molecule(
            id=mol_id,
            user_id=data.user_id,
            name=data.name,
            formula=data.formula or "",
            smiles=data.smiles,
            description=data.description or "",
            properties={},
            tags=[],
        )
        db.add(mol)
        await db.commit()
        return {"id": mol_id, "message": "Molecule saved"}
    except Exception as e:
        print(f"Save molecule error: {e}")
        await db.rollback()
        return {"error": str(e)}

@router.delete("/{molecule_id}")
async def delete_molecule(molecule_id: str, db: AsyncSession = Depends(get_db)):
    try:
        await db.execute(text("DELETE FROM molecules WHERE id = :id"), {"id": molecule_id})
        await db.commit()
        return {"message": "Deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search")
async def search_molecules(q: str, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(
            text("SELECT id, name, formula, smiles FROM molecules WHERE name ILIKE :q"),
            {"q": f"%{q}%"}
        )
        rows = result.fetchall()
        return [{"id": r[0], "name": r[1], "formula": r[2], "smiles": r[3]} for r in rows]
    except Exception as e:
        return []
