import { create } from 'zustand';
import type { Experiment } from '@/types';

interface ExperimentStore {
  experiments: Experiment[];
  activeExperiment: Experiment | null;
  isRunning: boolean;
  setExperiments: (experiments: Experiment[]) => void;
  setActive: (exp: Experiment | null) => void;
  addExperiment: (exp: Experiment) => void;
  setRunning: (running: boolean) => void;
}

export const useExperimentStore = create<ExperimentStore>((set) => ({
  experiments: [],
  activeExperiment: null,
  isRunning: false,
  setExperiments: (experiments) => set({ experiments }),
  setActive: (exp) => set({ activeExperiment: exp }),
  addExperiment: (exp) =>
    set((state) => ({ experiments: [exp, ...state.experiments] })),
  setRunning: (running) => set({ isRunning: running }),
}));
