'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { useMoleculeStore } from '@/store/moleculeStore';
import { useRouter } from 'next/navigation';
import { Atom, Copy, Eye, Save, Trash2, Info, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    $3Dmol: any;
  }
}

const ATOMS = [
  { symbol: 'C', name: 'Carbon',     color: '#6b7280', valence: 4 },
  { symbol: 'H', name: 'Hydrogen',   color: '#9ca3af', valence: 1 },
  { symbol: 'O', name: 'Oxygen',     color: '#ef4444', valence: 2 },
  { symbol: 'N', name: 'Nitrogen',   color: '#3b82f6', valence: 3 },
  { symbol: 'S', name: 'Sulfur',     color: '#eab308', valence: 2 },
  { symbol: 'P', name: 'Phosphorus', color: '#f97316', valence: 5 },
  { symbol: 'F', name: 'Fluorine',   color: '#22c55e', valence: 1 },
  { symbol: 'Cl', name: 'Chlorine',  color: '#84cc16', valence: 1 },
  { symbol: 'Br', name: 'Bromine',   color: '#a16207', valence: 1 },
];

const BOND_TYPES = [
  { id: 'single',   label: 'Single',   symbol: '—',  smiles: '',  display: '─' },
  { id: 'double',   label: 'Double',   symbol: '=',  smiles: '=', display: '═' },
  { id: 'triple',   label: 'Triple',   symbol: '≡',  smiles: '#', display: '≡' },
  { id: 'aromatic', label: 'Aromatic', symbol: '⊙',  smiles: ':', display: '⊙' },
];

const COMMON_FRAGMENTS = [
  { name: 'Methane',    smiles: 'C',              desc: 'CH₄' },
  { name: 'Ethane',     smiles: 'CC',             desc: 'C₂H₆' },
  { name: 'Benzene',    smiles: 'c1ccccc1',       desc: 'Aromatic' },
  { name: 'Carboxyl',   smiles: 'C(=O)O',         desc: '-COOH' },
  { name: 'Hydroxyl',   smiles: 'CO',             desc: '-OH' },
  { name: 'Amine',      smiles: 'CN',             desc: '-NH₂' },
  { name: 'Ketone',     smiles: 'CC(=O)C',        desc: 'C=O' },
  { name: 'Ester',      smiles: 'CC(=O)OC',       desc: '-COO-' },
  { name: 'Amide',      smiles: 'CC(=O)N',        desc: '-CONH₂' },
  { name: 'Aldehyde',   smiles: 'CC=O',           desc: '-CHO' },
];

export default function BuilderPage() {
  const [smilesChain, setSmilesChain]   = useState('C');
  const [selectedAtom, setSelectedAtom] = useState('C');
  const [selectedBond, setSelectedBond] = useState('single');
  const [history, setHistory]           = useState<string[]>(['C']);
  const [aiPrompt, setAiPrompt]         = useState('');
  const [aiLoading, setAiLoading]       = useState(false);
  const [viewerReady, setViewerReady]   = useState(false);
  const [viewerLoading, setViewerLoading] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewer3dRef = useRef<any>(null);
  const { setViewerSMILES } = useMoleculeStore();
  const router = useRouter();

  // Load 3Dmol.js
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.0.3/3Dmol-min.js';
    script.onload = () => setViewerReady(true);
    document.head.appendChild(script);
    return () => { try { document.head.removeChild(script); } catch {} };
  }, []);

  // Init viewer when ready
  useEffect(() => {
    if (!viewerReady || !viewerRef.current) return;
    viewer3dRef.current = window.$3Dmol.createViewer(viewerRef.current, {
      backgroundColor: 'transparent',
    });
    load3D(smilesChain);
  }, [viewerReady]);

  const load3D = async (smiles: string) => {
    if (!viewer3dRef.current || !smiles.trim()) return;
    setViewerLoading(true);
    try {
      const res = await fetch(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(smiles)}/SDF?record_type=3d`
      );
      if (!res.ok) throw new Error();
      const sdf = await res.text();
      const v = viewer3dRef.current;
      v.clear();
      v.addModel(sdf, 'sdf');
      v.setStyle({}, { stick: { colorscheme: 'Jmol', radius: 0.15 }, sphere: { scale: 0.25, colorscheme: 'Jmol' } });
      v.zoomTo();
      v.render();
    } catch {
      // Try 2D fallback
      try {
        const res = await fetch(
          `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(smiles)}/SDF`
        );
        if (res.ok) {
          const sdf = await res.text();
          const v = viewer3dRef.current;
          v.clear();
          v.addModel(sdf, 'sdf');
          v.setStyle({}, { stick: { colorscheme: 'Jmol', radius: 0.15 }, sphere: { scale: 0.25, colorscheme: 'Jmol' } });
          v.zoomTo();
          v.render();
        }
      } catch {}
    } finally {
      setViewerLoading(false);
    }
  };

  const addAtom = (symbol: string) => {
    setSelectedAtom(symbol);
    const bond = BOND_TYPES.find(b => b.id === selectedBond)?.smiles || '';
    const newSmiles = smilesChain + bond + symbol;
    setSmilesChain(newSmiles);
    setHistory(h => [...h, newSmiles]);
    if (viewerReady) load3D(newSmiles);
  };

  const addFragment = (smiles: string) => {
    const newSmiles = smilesChain + smiles;
    setSmilesChain(newSmiles);
    setHistory(h => [...h, newSmiles]);
    if (viewerReady) load3D(newSmiles);
  };

  const handleSmilesChange = (val: string) => {
    setSmilesChain(val);
    if (viewerReady) load3D(val);
  };

  const undo = () => {
    if (history.length <= 1) return;
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
    const prev = newHistory[newHistory.length - 1];
    setSmilesChain(prev);
    if (viewerReady) load3D(prev);
  };

  const clear = () => {
    setSmilesChain('C');
    setHistory(['C']);
    if (viewerReady) load3D('C');
  };

  const copySmiles = () => {
    navigator.clipboard.writeText(smilesChain);
    toast.success('SMILES copied!');
  };

  const goVisualize = () => {
    setViewerSMILES(smilesChain);
    router.push(`/visualizer?smiles=${encodeURIComponent(smilesChain)}`);
  };

  // AI Generate Molecule
  const generateWithAI = async () => {
    if (!aiPrompt.trim()) { toast.error('Describe a molecule first'); return; }
    setAiLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Generate a molecule for: "${aiPrompt}". 
          Respond with ONLY a valid SMILES string on the first line, nothing else. 
          Then on the next lines give: Name, Formula, and brief description.
          Format exactly like:
          SMILES: CC(=O)Oc1ccccc1C(=O)O
          Name: Aspirin
          Formula: C9H8O4
          Description: Pain reliever and anti-inflammatory`,
        }),
      });
      const data = await res.json();
      const text = data.text || '';
      // Extract SMILES from response
      const smilesMatch = text.match(/SMILES:\s*([^\n]+)/i);
      if (smilesMatch) {
        const generatedSmiles = smilesMatch[1].trim();
        setSmilesChain(generatedSmiles);
        setHistory(h => [...h, generatedSmiles]);
        if (viewerReady) load3D(generatedSmiles);
        toast.success('Molecule generated! 🧬');
      } else {
        // Try to find any SMILES-like string
        const lines = text.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed && /^[A-Za-z0-9@+\-\[\]()=#$.%/\\:*~^]+$/.test(trimmed) && trimmed.length > 1) {
            setSmilesChain(trimmed);
            setHistory(h => [...h, trimmed]);
            if (viewerReady) load3D(trimmed);
            toast.success('Molecule generated! 🧬');
            break;
          }
        }
      }
    } catch {
      toast.error('AI generation failed. Try again.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <>
      <Header title="Molecule Builder" subtitle="Build & generate molecules" />
      <main className="p-4 pt-20 space-y-4">

        {/* AI Generator */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(168,85,247,0.08))' }}
        >
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Sparkles size={14} className="text-purple-400" /> AI Molecule Generator
          </h3>
          <div className="flex gap-2">
            <input
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generateWithAI()}
              placeholder="e.g. painkiller similar to ibuprofen, antiviral drug..."
              className="input-neon flex-1 px-3 py-2.5 rounded-xl text-sm"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateWithAI}
              disabled={aiLoading}
              className="btn-neon px-4 py-2 text-sm flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
            >
              {aiLoading
                ? <><Loader2 size={14} className="animate-spin" /> Generating...</>
                : <><Sparkles size={14} /> Generate</>
              }
            </motion.button>
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            AI generates SMILES + shows 3D structure instantly in the viewer below
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Left: Atoms + Bonds */}
          <div className="space-y-4">

            {/* Atoms */}
            <div className="glass-card p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Atom size={14} className="text-blue-400" /> Atoms
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {ATOMS.map(atom => (
                  <motion.button
                    key={atom.symbol}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addAtom(atom.symbol)}
                    className={`p-2.5 rounded-xl text-center transition-all ${selectedAtom === atom.symbol ? 'ring-2 ring-blue-500' : ''}`}
                    style={{
                      background: `${atom.color}18`,
                      border: `1px solid ${atom.color}35`,
                    }}
                  >
                    <div className="text-sm font-bold" style={{ color: atom.color }}>{atom.symbol}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{atom.name.slice(0, 4)}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Bond Types — Triple bond = ≡ symbol, NO # */}
            <div className="glass-card p-4">
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Bond Type</h3>
              <div className="space-y-1.5">
                {BOND_TYPES.map(bond => (
                  <button
                    key={bond.id}
                    onClick={() => setSelectedBond(bond.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center gap-3 ${
                      selectedBond === bond.id
                        ? 'bg-blue-500/20 border-blue-500/40'
                        : 'hover:bg-white/5'
                    }`}
                    style={{
                      border: `1px solid ${selectedBond === bond.id ? 'rgba(59,130,246,0.4)' : 'var(--border)'}`,
                      color: selectedBond === bond.id ? '#60a5fa' : 'var(--text-secondary)',
                    }}
                  >
                    {/* Visual bond display — NO # symbol shown */}
                    <span className="text-lg font-bold w-6 text-center leading-none" style={{
                      color: selectedBond === bond.id ? '#60a5fa' : 'var(--text-muted)',
                      fontFamily: 'monospace',
                    }}>
                      {bond.display}
                    </span>
                    <span className="font-medium">{bond.label}</span>
                    {selectedBond === bond.id && (
                      <span className="ml-auto text-xs opacity-70">Selected</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center: SMILES + 3D Viewer */}
          <div className="glass-card p-4 flex flex-col gap-3">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              SMILES Builder + 3D Preview
            </h3>

            {/* SMILES Display */}
            <div
              className="p-3 rounded-xl font-mono text-sm break-all min-h-[60px]"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: '#22d3ee',
                lineHeight: '1.8',
              }}
            >
              {smilesChain || 'Start adding atoms...'}
            </div>

            {/* Edit directly */}
            <textarea
              value={smilesChain}
              onChange={e => handleSmilesChange(e.target.value)}
              rows={2}
              placeholder="Or type SMILES directly..."
              className="input-neon w-full px-3 py-2 rounded-xl text-sm font-mono resize-none"
            />

            {/* 3D Viewer — inline */}
            <div
              className="relative rounded-xl overflow-hidden"
              style={{
                height: '220px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              {viewerLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/20">
                  <div className="molecule-loader" style={{ width: '32px', height: '32px', borderWidth: '2px' }} />
                </div>
              )}
              {!viewerReady && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="molecule-loader" style={{ width: '32px', height: '32px', borderWidth: '2px' }} />
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Loading 3D engine...</span>
                  </div>
                </div>
              )}
              <div ref={viewerRef} className="w-full h-full" />
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={undo}
                className="px-3 py-1.5 rounded-lg text-xs hover:bg-white/10 transition-colors"
                style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              >
                ↩ Undo
              </button>
              <button
                onClick={clear}
                className="px-3 py-1.5 rounded-lg text-xs hover:bg-red-500/10 transition-colors flex items-center gap-1"
                style={{ border: '1px solid var(--border)', color: '#ef4444' }}
              >
                <Trash2 size={11} /> Clear
              </button>
              <button
                onClick={copySmiles}
                className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 hover:bg-white/10 transition-colors flex-1"
                style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              >
                <Copy size={11} /> Copy SMILES
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={goVisualize}
                className="btn-neon px-4 py-1.5 text-xs flex items-center gap-1"
              >
                <Eye size={11} /> Full 3D View
              </motion.button>
            </div>
          </div>

          {/* Right: Common Fragments */}
          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Common Fragments
            </h3>
            <div className="space-y-1.5">
              {COMMON_FRAGMENTS.map(frag => (
                <motion.button
                  key={frag.name}
                  whileHover={{ x: 4 }}
                  onClick={() => addFragment(frag.smiles)}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors flex items-center justify-between group"
                  style={{ border: '1px solid transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.border = '1px solid var(--border)'; }}
                  onMouseLeave={e => { e.currentTarget.style.border = '1px solid transparent'; }}
                >
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{frag.name}</div>
                    <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{frag.desc}</div>
                  </div>
                  <div
                    className="text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: '#22d3ee' }}
                  >
                    {frag.smiles.slice(0, 10)}
                  </div>
                </motion.button>
              ))}
            </div>

            <div
              className="mt-3 p-3 rounded-xl"
              style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
            >
              <div className="flex items-start gap-2">
                <Info size={13} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Click atoms or fragments to build. 3D structure updates live in the center panel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
