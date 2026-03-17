"""
Molecule Service — PubChem + RDKit integration.
All free, no API keys needed for PubChem.
"""

import httpx
from typing import Optional
from utils.rdkit_helpers import smiles_to_properties, check_lipinski, validate_smiles

PUBCHEM_BASE = "https://pubchem.ncbi.nlm.nih.gov/rest/pug"
CHEMBL_BASE = "https://www.ebi.ac.uk/chembl/api/data"


async def search_pubchem(query: str) -> dict:
    """Search PubChem by compound name."""
    url = f"{PUBCHEM_BASE}/compound/name/{query}/property/MolecularFormula,MolecularWeight,CanonicalSMILES,IUPACName,IsomericSMILES/JSON"

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(url)
        if response.status_code == 200:
            data = response.json()
            return data.get("PropertyTable", {}).get("Properties", [])
        return []


async def get_sdf_3d(smiles: str) -> Optional[str]:
    """Get 3D SDF structure from PubChem."""
    url = f"{PUBCHEM_BASE}/compound/smiles/{smiles}/SDF?record_type=3d"

    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            response = await client.get(url)
            if response.status_code == 200:
                return response.text
        except Exception:
            pass

    # Fallback: 2D
    url_2d = f"{PUBCHEM_BASE}/compound/smiles/{smiles}/SDF"
    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(url_2d)
            if response.status_code == 200:
                return response.text
        except Exception:
            pass

    return None


async def get_molecule_properties(smiles: str) -> dict:
    """Get comprehensive properties for a molecule."""
    properties = {}

    # Local RDKit calculation
    rdkit_props = smiles_to_properties(smiles)
    if "error" not in rdkit_props:
        properties["computed"] = rdkit_props

    # Lipinski check
    lipinski = check_lipinski(smiles)
    if "lipinski" in lipinski:
        properties["lipinski"] = lipinski["lipinski"]

    # PubChem lookup
    try:
        url = f"{PUBCHEM_BASE}/compound/smiles/{smiles}/property/MolecularFormula,MolecularWeight,IUPACName/JSON"
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)
            if response.status_code == 200:
                data = response.json()
                props = data.get("PropertyTable", {}).get("Properties", [{}])[0]
                properties["pubchem"] = {
                    "formula": props.get("MolecularFormula"),
                    "molecular_weight": props.get("MolecularWeight"),
                    "iupac_name": props.get("IUPACName"),
                }
    except Exception:
        pass

    return properties


async def similarity_search(smiles: str, threshold: float = 0.8) -> list:
    """Find similar compounds in PubChem."""
    url = f"{PUBCHEM_BASE}/compound/fastsimilarity_2d/smiles/{smiles}/cids/JSON?Threshold={int(threshold * 100)}&MaxRecords=5"

    async with httpx.AsyncClient(timeout=20.0) as client:
        try:
            response = await client.get(url)
            if response.status_code == 200:
                cids = response.json().get("IdentifierList", {}).get("CID", [])[:5]

                # Get properties for found CIDs
                results = []
                for cid in cids:
                    prop_url = f"{PUBCHEM_BASE}/compound/cid/{cid}/property/MolecularFormula,CanonicalSMILES,IUPACName/JSON"
                    prop_resp = await client.get(prop_url)
                    if prop_resp.status_code == 200:
                        props = prop_resp.json().get("PropertyTable", {}).get("Properties", [{}])[0]
                        results.append({
                            "cid": cid,
                            "smiles": props.get("CanonicalSMILES"),
                            "formula": props.get("MolecularFormula"),
                            "name": props.get("IUPACName"),
                        })
                return results
        except Exception:
            pass

    return []
