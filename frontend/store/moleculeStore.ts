import { create } from 'zustand';
import type { Molecule } from '@/types';

interface MoleculeStore {
  molecules: Molecule[];
  currentMolecule: Molecule | null;
  viewerSMILES: string;
  renderMode: 'stick' | 'sphere' | 'line';
  isLoading: boolean;
  setMolecules: (molecules: Molecule[]) => void;
  setCurrentMolecule: (molecule: Molecule | null) => void;
  setViewerSMILES: (smiles: string) => void;
  setRenderMode: (mode: 'stick' | 'sphere' | 'line') => void;
  addMolecule: (molecule: Molecule) => void;
  removeMolecule: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useMoleculeStore = create<MoleculeStore>((set) => ({
  molecules: [],
  currentMolecule: null,
  viewerSMILES: 'CC(=O)Oc1ccccc1C(=O)O', // Aspirin as default
  renderMode: 'stick',
  isLoading: false,
  setMolecules: (molecules) => set({ molecules }),
  setCurrentMolecule: (molecule) => set({ currentMolecule: molecule }),
  setViewerSMILES: (smiles) => set({ viewerSMILES: smiles }),
  setRenderMode: (mode) => set({ renderMode: mode }),
  addMolecule: (molecule) =>
    set((state) => ({ molecules: [molecule, ...state.molecules] })),
  removeMolecule: (id) =>
    set((state) => ({ molecules: state.molecules.filter((m) => m.id !== id) })),
  setLoading: (loading) => set({ isLoading: loading }),
}));
