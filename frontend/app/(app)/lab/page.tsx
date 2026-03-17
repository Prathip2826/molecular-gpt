'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { Beaker, Loader2, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const TOOLS = [
  { 
    id: 'generator', 
    title: 'Molecule Generator', 
    desc: 'Describe a molecule and AI generates its structure and SMILES', 
    placeholder: 'Generate a molecule that could act as a painkiller similar to ibuprofen' 
  },
  { 
    id: 'optimizer', 
    title: 'Structure Optimizer', 
    desc: 'Suggest improvements to an existing molecule for better drug properties', 
    placeholder: 'Optimize aspirin to reduce gastric side effects while maintaining anti-inflammatory activity' 
  },
  { 
    id: 'drug_finder', 
    title: 'Drug Candidate Finder', 
    desc: 'Find potential drug candidates for a specific disease target', 
    placeholder: 'Find drug candidates targeting COVID-19 main protease' 
  },
  { 
    id: 'toxicity', 
    title: 'Toxicity Predictor', 
    desc: 'Predict toxicity alerts and safety profile of any molecule', 
    placeholder: 'Analyze toxicity of CC(=O)Oc1ccccc1C(=O)O (Aspirin)' 
  },
];

export default function LabPage() {
  const [selected, setSelected] = useState(TOOLS[0]);
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!input.trim()) { 
      toast.error('Enter an input first'); 
      return; 
    }
    setLoading(true); 
    setResult('');

    try {
      // ✅ Groq API via Next.js route
      const res = await fetch('/api/lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          toolId: selected.id, 
          input 
        }),
      });
      const data = await res.json();
      setResult(data.result || 'No response. Try again.');
      toast.success('Analysis complete!');
    } catch { 
      toast.error('AI request failed. Try again.'); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <>
      <Header title="AI Lab" subtitle="Advanced molecular AI tools" />
      <main className="p-6 pt-20 space-y-6">

        {/* Tool Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {TOOLS.map((t, i) => (
            <motion.div 
              key={t.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={() => { setSelected(t); setResult(''); setInput(''); }}
              className={`glass-card p-4 cursor-pointer transition-all ${
                selected.id === t.id ? 'border-blue-500/60' : ''
              }`}
              style={selected.id === t.id ? { 
                boxShadow: '0 0 20px rgba(59,130,246,0.25)' 
              } : {}}
            >
              <Beaker size={20} className="text-blue-400 mb-2" />
              <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {t.title}
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {t.desc}
              </p>
              {selected.id === t.id && (
                <div className="text-xs text-blue-400 mt-2">✓ Selected</div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Input Panel */}
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-semibold text-sm flex items-center gap-2" 
            style={{ color: 'var(--text-primary)' }}>
            <Beaker size={16} className="text-blue-400" />
            {selected.title}
          </h3>
          <textarea 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            placeholder={selected.placeholder}
            rows={4} 
            className="input-neon w-full px-4 py-3 rounded-xl text-sm resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) run();
            }}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Ctrl+Enter to run
            </p>
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }} 
              onClick={run} 
              disabled={loading || !input.trim()}
              className="btn-neon px-6 py-2.5 text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {loading 
                ? <><Loader2 size={14} className="animate-spin" /> Running AI...</> 
                : <><Zap size={14} /> Run AI Lab</>
              }
            </motion.button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="glass-card p-5"
          >
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" 
              style={{ color: 'var(--text-primary)' }}>
              ✅ Result — {selected.title}
            </h4>
            <pre 
              className="text-sm whitespace-pre-wrap leading-relaxed" 
              style={{ 
                color: 'var(--text-primary)', 
                fontFamily: 'Plus Jakarta Sans, sans-serif' 
              }}
            >
              {result}
            </pre>
          </motion.div>
        )}

      </main>
    </>
  );
}