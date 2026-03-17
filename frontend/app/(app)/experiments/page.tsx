'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/header';
import {
  FlaskConical, Zap, Shield, Search, BarChart2,
  Loader2, ChevronRight, CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

const EXPERIMENTS = [
  {
    id: 'reaction_prediction',
    icon: FlaskConical,
    title: 'Reaction Predictor',
    desc: 'Predict products of a chemical reaction using AI',
    color: 'from-blue-500 to-cyan-500',
    inputs: [
      { key: 'reactantA', label: 'Reactant A (SMILES or name)', placeholder: 'CC(=O)O (Acetic Acid)' },
      { key: 'reactantB', label: 'Reactant B (SMILES or name)', placeholder: 'CCO (Ethanol)' },
      { key: 'conditions', label: 'Conditions (optional)', placeholder: 'H2SO4, heat' },
    ],
  },
  {
    id: 'toxicity',
    icon: Shield,
    title: 'Toxicity Predictor',
    desc: 'Estimate toxicity risk of a molecule using Lipinski rules',
    color: 'from-red-500 to-orange-500',
    inputs: [
      { key: 'molecule', label: 'Molecule (name or SMILES)', placeholder: 'Aspirin' },
    ],
  },
  {
    id: 'similarity',
    icon: Search,
    title: 'Similarity Search',
    desc: 'Find structurally similar molecules from PubChem',
    color: 'from-purple-500 to-pink-500',
    inputs: [
      { key: 'query', label: 'Query molecule', placeholder: 'Ibuprofen' },
    ],
  },
  {
    id: 'drug_analysis',
    icon: BarChart2,
    title: 'Drug Candidate Analysis',
    desc: 'Evaluate drug-likeness using Lipinski Rule of Five',
    color: 'from-teal-500 to-emerald-500',
    inputs: [
      { key: 'smiles', label: 'SMILES string', placeholder: 'CC(=O)Oc1ccccc1C(=O)O' },
    ],
  },
];

interface ExperimentResult {
  type: string;
  content: string;
  timestamp: string;
}

export default function ExperimentsPage() {
  const [selectedExp, setSelectedExp] = useState<typeof EXPERIMENTS[0] | null>(null);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ExperimentResult | null>(null);

  const runExperiment = async () => {
    if (!selectedExp) return;
    setIsRunning(true);
    setResult(null);

    try {
      // ✅ Groq API via Next.js route
      const res = await fetch('/api/experiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: selectedExp.id, 
          inputs 
        }),
      });
      const data = await res.json();

      setResult({ 
        type: selectedExp.title, 
        content: data.result || 'No result received.', 
        timestamp: new Date().toLocaleString() 
      });
      toast.success('Experiment completed!');
    } catch {
      toast.error('Experiment failed. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <>
      <Header title="Experiments" subtitle="AI-powered chemistry experiments" />
      <main className="p-6 pt-20 space-y-6">

        {/* Experiment Cards */}
        <div>
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>
            Choose an Experiment
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EXPERIMENTS.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={() => { setSelectedExp(exp); setInputs({}); setResult(null); }}
                className={`experiment-card cursor-pointer ${selectedExp?.id === exp.id ? 'border-blue-500/60' : ''}`}
                style={selectedExp?.id === exp.id ? { boxShadow: '0 0 20px rgba(59,130,246,0.3)' } : {}}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${exp.color} flex items-center justify-center mb-3`}>
                  <exp.icon size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                  {exp.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {exp.desc}
                </p>
                {selectedExp?.id === exp.id && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-blue-400">
                    <CheckCircle2 size={12} /> Selected
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Selected Experiment Form */}
        <AnimatePresence>
          {selectedExp && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-6"
            >
              <h3 className="text-base font-bold mb-4 flex items-center gap-2" 
                style={{ color: 'var(--text-primary)' }}>
                <selectedExp.icon size={18} className="text-blue-400" /> 
                {selectedExp.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {selectedExp.inputs.map((inp) => (
                  <div key={inp.key}>
                    <label className="text-xs font-medium mb-1.5 block" 
                      style={{ color: 'var(--text-secondary)' }}>
                      {inp.label}
                    </label>
                    <input
                      value={inputs[inp.key] || ''}
                      onChange={(e) => setInputs((prev) => ({ ...prev, [inp.key]: e.target.value }))}
                      placeholder={inp.placeholder}
                      className="input-neon w-full px-3 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={runExperiment}
                disabled={isRunning}
                className="btn-neon flex items-center gap-2 px-6 py-2.5 text-sm disabled:opacity-50"
              >
                {isRunning
                  ? <><Loader2 size={16} className="animate-spin" /> Running Experiment...</>
                  : <><Zap size={16} /> Run Experiment <ChevronRight size={14} /></>
                }
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2" 
                  style={{ color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={16} className="text-teal-400" /> 
                  Results: {result.type}
                </h3>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {result.timestamp}
                </span>
              </div>
              <div
                className="text-sm leading-relaxed whitespace-pre-wrap p-4 rounded-xl"
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
              >
                {result.content}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </>
  );
}