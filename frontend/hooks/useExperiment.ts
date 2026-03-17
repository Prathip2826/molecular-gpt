'use client';
import { useState, useCallback } from 'react';
import { hfApi } from '@/lib/api';

export type ExperimentType = 'reaction_prediction' | 'toxicity' | 'similarity' | 'drug_analysis';

export interface ExperimentResult {
  id: string;
  type: ExperimentType;
  title: string;
  inputs: Record<string, string>;
  output: string;
  timestamp: string;
  status: 'completed' | 'failed';
}

const PROMPTS: Record<ExperimentType, (inp: Record<string, string>) => string> = {
  reaction_prediction: (i) =>
    `Chemistry expert: predict the main product of: Reactant A: ${i.reactantA || 'Unknown'}, Reactant B: ${i.reactantB || 'Unknown'}, Conditions: ${i.conditions || 'standard'}. Give: product SMILES, mechanism, yield estimate.`,
  toxicity: (i) =>
    `Toxicologist: evaluate toxicity of ${i.molecule || 'Unknown'}. Give: LD50 estimate, toxic effects, safety class, max safe dose.`,
  similarity: (i) =>
    `Cheminformatics expert: list 5 molecules similar to ${i.query || 'Unknown'}. Include names, SMILES, structural features.`,
  drug_analysis: (i) =>
    `Medicinal chemist: analyze drug-likeness of SMILES: ${i.smiles || 'CC(=O)Oc1ccccc1C(=O)O'}. Apply Lipinski Rule of Five. Give MW, LogP, HBD, HBA, oral bioavailability.`,
};

export function useExperiment() {
  const [results, setResults] = useState<ExperimentResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (type: ExperimentType, inputs: Record<string, string>) => {
    setIsRunning(true);
    setError(null);

    const prompt = PROMPTS[type](inputs);

    try {
      const response = await hfApi.generateText(prompt);
      let text = '';

      if (Array.isArray(response) && response[0]?.generated_text) {
        text = response[0].generated_text;
        const idx = text.lastIndexOf('[/INST]');
        text = idx !== -1 ? text.slice(idx + 7).trim() : text;
      } else if (response?.error) {
        text = 'AI model warming up. Please try again in ~20 seconds.';
      } else {
        text = 'Unexpected response. Please try again.';
      }

      const result: ExperimentResult = {
        id: Date.now().toString(),
        type,
        title: `${type.replace(/_/g, ' ')} — ${Object.values(inputs)[0] || 'Analysis'}`,
        inputs,
        output: text,
        timestamp: new Date().toISOString(),
        status: 'completed',
      };

      setResults((prev) => [result, ...prev.slice(0, 19)]); // keep last 20
      return result;
    } catch (err) {
      setError('Experiment failed. Check your HuggingFace API key.');
      return null;
    } finally {
      setIsRunning(false);
    }
  }, []);

  const clearHistory = useCallback(() => setResults([]), []);

  return { results, isRunning, error, run, clearHistory };
}
