'use client';
import { useState, useCallback } from 'react';
import { pubchemApi } from '@/lib/api';
import { useMoleculeStore } from '@/store/moleculeStore';
import type { Molecule, PubChemCompound } from '@/types';

export function useMolecule() {
  const [searchResults, setSearchResults] = useState<PubChemCompound[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setViewerSMILES, setCurrentMolecule, addMolecule } = useMoleculeStore();

  const searchMolecule = useCallback(async (query: string) => {
    setIsSearching(true);
    setError(null);
    try {
      const data = await pubchemApi.searchByName(query);
      if (data.PropertyTable?.Properties) {
        const compounds = data.PropertyTable.Properties as PubChemCompound[];
        setSearchResults(compounds);

        if (compounds.length > 0) {
          const first = compounds[0];
          setViewerSMILES(first.CanonicalSMILES);
          const mol: Molecule = {
            id: first.CID.toString(),
            userId: '',
            name: query,
            formula: first.MolecularFormula,
            smiles: first.CanonicalSMILES,
            description: first.IUPACName,
            properties: {
              molecularWeight: parseFloat(first.MolecularWeight),
            },
            tags: [],
            createdAt: new Date().toISOString(),
          };
          setCurrentMolecule(mol);
        }
      } else {
        setError('Molecule not found. Try a different name or SMILES string.');
      }
    } catch {
      setError('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }, [setViewerSMILES, setCurrentMolecule]);

  const loadFromSMILES = useCallback((smiles: string) => {
    setViewerSMILES(smiles);
  }, [setViewerSMILES]);

  const saveMolecule = useCallback(async (molecule: Molecule) => {
  addMolecule(molecule);
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    await fetch(`${API_URL}/molecules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: molecule.userId,
        name: molecule.name,
        smiles: molecule.smiles,
        formula: molecule.formula,
        description: molecule.description || '',
        properties: molecule.properties || {},
        tags: molecule.tags || [],
      }),
    });
  } catch (e) {
    console.error('Save failed:', e);
  }
}, [addMolecule]);

  // Common molecules quick load
  const commonMolecules = [
    { name: 'Water', smiles: 'O', formula: 'H₂O' },
    { name: 'Aspirin', smiles: 'CC(=O)Oc1ccccc1C(=O)O', formula: 'C₉H₈O₄' },
    { name: 'Caffeine', smiles: 'Cn1cnc2c1c(=O)n(c(=O)n2C)C', formula: 'C₈H₁₀N₄O₂' },
    { name: 'Glucose', smiles: 'OC[C@H]1OC(O)[C@H](O)[C@@H](O)[C@@H]1O', formula: 'C₆H₁₂O₆' },
    { name: 'Benzene', smiles: 'c1ccccc1', formula: 'C₆H₆' },
    { name: 'Ethanol', smiles: 'CCO', formula: 'C₂H₅OH' },
    { name: 'Paracetamol', smiles: 'CC(=O)Nc1ccc(O)cc1', formula: 'C₈H₉NO₂' },
    { name: 'Ibuprofen', smiles: 'CC(C)Cc1ccc(cc1)C(C)C(=O)O', formula: 'C₁₃H₁₈O₂' },
  ];

  return {
    searchResults,
    isSearching,
    error,
    commonMolecules,
    searchMolecule,
    loadFromSMILES,
    saveMolecule,
  };
}

