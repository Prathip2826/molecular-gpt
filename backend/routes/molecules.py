from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional, List
from database import get_db
from models.models import Molecule

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
    result = await db.execute(
        select(Molecule).where(Molecule.user_id == user_id).order_by(Molecule.created_at.desc())
    )
    molecules = result.scalars().all()
    return [{"id": m.id, "name": m.name, "formula": m.formula,
             "smiles": m.smiles, "tags": m.tags, "createdAt": str(m.created_at)} for m in molecules]

@router.post("")
async def create_molecule(data: MoleculeCreate, db: AsyncSession = Depends(get_db)):
    mol = Molecule(
        user_id=data.user_id, name=data.name, formula=data.formula,
        smiles=data.smiles, description=data.description,
        properties=data.properties, tags=data.tags
    )
    db.add(mol)
    await db.commit()
    await db.refresh(mol)
    return {"id": mol.id, "message": "Molecule saved"}

@router.delete("/{molecule_id}")
async def delete_molecule(molecule_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Molecule).where(Molecule.id == molecule_id))
    mol = result.scalar_one_or_none()
    if not mol:
        raise HTTPException(status_code=404, detail="Molecule not found")
    await db.delete(mol)
    await db.commit()
    return {"message": "Deleted"}

@router.get("/search")
async def search_molecules(q: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Molecule).where(Molecule.name.ilike(f"%{q}%"))
    )
    molecules = result.scalars().all()
    return molecules
