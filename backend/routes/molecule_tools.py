from fastapi import APIRouter, Query
from services.molecule_service import (
    search_pubchem, get_molecule_properties, similarity_search, get_sdf_3d
)
from utils.rdkit_helpers import validate_smiles, check_lipinski

router = APIRouter()

@router.get("/pubchem/search")
async def pubchem_search(q: str = Query(..., description="Molecule name to search")):
    results = await search_pubchem(q)
    return {"results": results, "count": len(results)}

@router.get("/properties")
async def molecule_properties(smiles: str = Query(..., description="SMILES string")):
    if not validate_smiles(smiles):
        return {"error": "Invalid SMILES string", "smiles": smiles}
    props = await get_molecule_properties(smiles)
    return props

@router.get("/lipinski")
async def lipinski_check(smiles: str = Query(..., description="SMILES string")):
    if not validate_smiles(smiles):
        return {"error": "Invalid SMILES string"}
    return check_lipinski(smiles)

@router.get("/sdf")
async def get_sdf(smiles: str = Query(..., description="SMILES string")):
    sdf = await get_sdf_3d(smiles)
    if sdf:
        return {"sdf": sdf}
    return {"error": "3D structure not available"}

@router.get("/similar")
async def find_similar(smiles: str = Query(...), threshold: float = Query(default=0.7)):
    results = await similarity_search(smiles, threshold)
    return {"results": results, "count": len(results)}
