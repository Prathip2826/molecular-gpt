"""
RDKit utility helpers for molecule processing.
Install: pip install rdkit
"""

try:
    from rdkit import Chem
    from rdkit.Chem import Descriptors, rdMolDescriptors, Draw
    from rdkit.Chem.Draw import rdMolDraw2D
    import base64
    from io import BytesIO
    RDKIT_AVAILABLE = True
except ImportError:
    RDKIT_AVAILABLE = False
    print("⚠️  RDKit not installed. Using fallback mode.")


def smiles_to_properties(smiles: str) -> dict:
    """Calculate molecular properties from SMILES string."""
    if not RDKIT_AVAILABLE:
        return {"error": "RDKit not installed", "smiles": smiles}

    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return {"error": "Invalid SMILES string"}

    return {
        "molecular_weight": round(Descriptors.ExactMolWt(mol), 3),
        "logp": round(Descriptors.MolLogP(mol), 3),
        "hbd": rdMolDescriptors.CalcNumHBD(mol),   # H-bond donors
        "hba": rdMolDescriptors.CalcNumHBA(mol),   # H-bond acceptors
        "rotatable_bonds": rdMolDescriptors.CalcNumRotatableBonds(mol),
        "tpsa": round(Descriptors.TPSA(mol), 2),
        "num_rings": rdMolDescriptors.CalcNumRings(mol),
        "num_aromatic_rings": rdMolDescriptors.CalcNumAromaticRings(mol),
        "formula": rdMolDescriptors.CalcMolFormula(mol),
        "heavy_atoms": mol.GetNumHeavyAtoms(),
    }


def check_lipinski(smiles: str) -> dict:
    """Check Lipinski Rule of Five for oral bioavailability."""
    props = smiles_to_properties(smiles)
    if "error" in props:
        return props

    mw = props["molecular_weight"]
    logp = props["logp"]
    hbd = props["hbd"]
    hba = props["hba"]

    violations = sum([
        mw > 500,
        logp > 5,
        hbd > 5,
        hba > 10,
    ])

    return {
        **props,
        "lipinski": {
            "mw_ok": mw <= 500,
            "logp_ok": logp <= 5,
            "hbd_ok": hbd <= 5,
            "hba_ok": hba <= 10,
            "violations": violations,
            "oral_bioavailable": violations <= 1,
            "drug_like": violations == 0,
        }
    }


def smiles_to_png_base64(smiles: str, width: int = 300, height: int = 200) -> str | None:
    """Convert SMILES to a PNG image encoded as base64."""
    if not RDKIT_AVAILABLE:
        return None

    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return None

    drawer = rdMolDraw2D.MolDraw2DCairo(width, height)
    drawer.drawOptions().addStereoAnnotation = True
    drawer.DrawMolecule(mol)
    drawer.FinishDrawing()
    png = drawer.GetDrawingText()
    return base64.b64encode(png).decode()


def validate_smiles(smiles: str) -> bool:
    """Validate if a SMILES string represents a valid molecule."""
    if not RDKIT_AVAILABLE:
        # Basic syntax check without RDKit
        if not smiles or len(smiles.strip()) == 0:
            return False
        valid_chars = set('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@+-[]()=#$./%\\:*~^')
        return all(c in valid_chars for c in smiles.strip())

    return Chem.MolFromSmiles(smiles) is not None


def canonicalize_smiles(smiles: str) -> str | None:
    """Return canonical SMILES form."""
    if not RDKIT_AVAILABLE:
        return smiles

    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return None
    return Chem.MolToSmiles(mol)
