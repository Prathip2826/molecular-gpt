'use client';
import { useEffect, useRef, useState, Suspense, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { useMolecule } from '@/hooks/useMolecule';
import { useMoleculeStore } from '@/store/moleculeStore';
import { Search, RotateCcw, Download, Bookmark, Loader2, Info, ZoomIn } from 'lucide-react';
import toast from 'react-hot-toast';

declare global {
  interface Window { $3Dmol: any; }
}

function VisualizerContent() {
  const searchParams = useSearchParams();
  const viewerRef   = useRef<HTMLDivElement>(null);
  const viewer3d    = useRef<any>(null);
  const scriptRef   = useRef<HTMLScriptElement | null>(null);

  const [smilesInput, setSmilesInput] = useState('CC(=O)Oc1ccccc1C(=O)O');
  const [isLoading, setIsLoading]     = useState(false);
  const [isSpinning, setIsSpinning]   = useState(false);
  const [viewerReady, setViewerReady] = useState(false);
  const [molInfo, setMolInfo]         = useState<{ name: string; formula: string; weight: string } | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [renderMode, setRenderMode]   = useState<'stick' | 'sphere' | 'line'>('stick');

  const { searchMolecule, isSearching } = useMolecule();

  // ── Load 3Dmol script ─────────────────────────────────────
  useEffect(() => {
    if (window.$3Dmol) {
      setViewerReady(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/3Dmol/2.0.3/3Dmol-min.js';
    script.async = true;
    script.onload = () => {
      console.log('3Dmol loaded');
      setViewerReady(true);
    };
    script.onerror = () => {
      // Fallback CDN
      const fallback = document.createElement('script');
      fallback.src = 'https://3dmol.org/build/3Dmol-min.js';
      fallback.async = true;
      fallback.onload = () => setViewerReady(true);
      document.head.appendChild(fallback);
    };
    document.head.appendChild(script);
    scriptRef.current = script;
    return () => {
      try { if (scriptRef.current) document.head.removeChild(scriptRef.current); } catch {}
    };
  }, []);

  // ── Init viewer once 3Dmol + DOM ready ────────────────────
  useEffect(() => {
    if (!viewerReady || !viewerRef.current) return;

    // Wait a tick for DOM to be fully painted
    const timer = setTimeout(() => {
      if (!viewerRef.current || viewer3d.current) return;
      try {
        const config = {
          backgroundColor: 'transparent',
          antialias: true,
        };
        viewer3d.current = window.$3Dmol.createViewer(viewerRef.current, config);
        console.log('Viewer created');
        // Load default molecule
        loadSMILES(smilesInput);
      } catch (e) {
        console.error('Viewer init error:', e);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [viewerReady]);

  // ── URL param ─────────────────────────────────────────────
  useEffect(() => {
    const s = searchParams.get('smiles');
    if (s) {
      setSmilesInput(s);
      if (viewerReady && viewer3d.current) loadSMILES(s);
    }
  }, [searchParams, viewerReady]);

  // ── Apply render style ────────────────────────────────────
  const applyStyle = useCallback((mode: 'stick' | 'sphere' | 'line') => {
    if (!viewer3d.current) return;
    viewer3d.current.setStyle({}, {});
    if (mode === 'stick') {
      viewer3d.current.setStyle({}, {
        stick:  { colorscheme: 'Jmol', radius: 0.15 },
        sphere: { scale: 0.25, colorscheme: 'Jmol' },
      });
    } else if (mode === 'sphere') {
      viewer3d.current.setStyle({}, { sphere: { colorscheme: 'Jmol' } });
    } else {
      viewer3d.current.setStyle({}, { line: { colorscheme: 'Jmol' } });
    }
    viewer3d.current.render();
  }, []);

  // ── Load SMILES → fetch SDF → render ─────────────────────
  const loadSMILES = useCallback(async (smiles: string) => {
    if (!smiles.trim() || !viewer3d.current) return;
    setIsLoading(true);

    const tryLoad = async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    };

    let sdf: string | null = null;

    // 1) Try 3D SDF
    try {
      sdf = await tryLoad(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(smiles)}/SDF?record_type=3d`
      );
    } catch {}

    // 2) Fallback 2D SDF
    if (!sdf) {
      try {
        sdf = await tryLoad(
          `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(smiles)}/SDF`
        );
      } catch {}
    }

    if (sdf && sdf.includes('$$$$') && viewer3d.current) {
      try {
        viewer3d.current.clear();
        viewer3d.current.addModel(sdf, 'sdf');
        applyStyle(renderMode);
        viewer3d.current.zoomTo();
        viewer3d.current.render();
        toast.success('Molecule loaded! 🧬');
      } catch (e) {
        console.error('Render error:', e);
        toast.error('3D render failed');
      }
    } else {
      toast.error('Could not load this molecule. Try a different SMILES.');
    }

    // Fetch properties
    try {
      const res = await fetch(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/${encodeURIComponent(smiles)}/property/MolecularFormula,MolecularWeight,IUPACName/JSON`
      );
      const data = await res.json();
      const p = data?.PropertyTable?.Properties?.[0];
      if (p) setMolInfo({ name: p.IUPACName || 'Unknown', formula: p.MolecularFormula, weight: p.MolecularWeight });
    } catch {}

    setIsLoading(false);
  }, [applyStyle, renderMode]);

  // ── Render mode change ────────────────────────────────────
  const handleRenderChange = (mode: 'stick' | 'sphere' | 'line') => {
    setRenderMode(mode);
    applyStyle(mode);
  };

  // ── Spin ─────────────────────────────────────────────────
  const toggleSpin = () => {
    if (!viewer3d.current) return;
    if (isSpinning) {
      viewer3d.current.stopAnimate();
    } else {
      viewer3d.current.spin('y', 1);
    }
    setIsSpinning(p => !p);
  };

  // ── Search by name ────────────────────────────────────────
  const handleSearch = async () => {
    if (!searchInput.trim()) return;
    try {
      const res = await fetch(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(searchInput)}/property/CanonicalSMILES/JSON`
      );
      const data = await res.json();
      const smiles = data?.PropertyTable?.Properties?.[0]?.CanonicalSMILES;
      if (smiles) {
        setSmilesInput(smiles);
        loadSMILES(smiles);
      } else {
        toast.error('Molecule not found');
      }
    } catch {
      toast.error('Search failed');
    }
  };

  const COMMON = [
    { name: 'Aspirin',     smiles: 'CC(=O)Oc1ccccc1C(=O)O' },
    { name: 'Caffeine',    smiles: 'Cn1cnc2c1c(=O)n(c(=O)n2C)C' },
    { name: 'Benzene',     smiles: 'c1ccccc1' },
    { name: 'Glucose',     smiles: 'OC[C@H]1OC(O)[C@H](O)[C@@H](O)[C@@H]1O' },
    { name: 'Paracetamol', smiles: 'CC(=O)Nc1ccc(O)cc1' },
    { name: 'Ethanol',     smiles: 'CCO' },
  ];

  const RENDER_MODES = [
    { id: 'stick'  as const, label: 'Ball & Stick' },
    { id: 'sphere' as const, label: 'Space Fill' },
    { id: 'line'   as const, label: 'Wireframe' },
  ];

  return (
    <>
      <Header title="Molecule Visualizer" subtitle="3D Interactive Viewer" />
      <main className="p-4 pt-20 grid grid-cols-1 lg:grid-cols-4 gap-4" style={{ height: 'calc(100vh - 4rem)' }}>

        {/* ── Left Panel ── */}
        <div className="glass-card p-4 space-y-4 overflow-y-auto">

          {/* Search */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
              Search by Name
            </label>
            <div className="flex gap-2">
              <input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Aspirin, Caffeine..."
                className="input-neon flex-1 px-3 py-2 rounded-lg text-sm"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="btn-neon px-3 py-2 rounded-lg flex items-center justify-center"
              >
                {isSearching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
              </button>
            </div>
          </div>

          {/* SMILES Input */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
              Enter SMILES
            </label>
            <textarea
              value={smilesInput}
              onChange={e => setSmilesInput(e.target.value)}
              rows={3}
              className="input-neon w-full px-3 py-2 rounded-lg text-xs font-mono resize-none"
              placeholder="CC(=O)Oc1ccccc1C(=O)O"
            />
            <button
              onClick={() => loadSMILES(smilesInput)}
              disabled={isLoading || !viewerReady}
              className="btn-neon w-full mt-2 py-2 text-sm rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading
                ? <><Loader2 size={14} className="animate-spin" /> Loading...</>
                : <><ZoomIn size={14} /> Visualize</>
              }
            </button>
          </div>

          {/* Quick Load */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
              Quick Load
            </label>
            <div className="space-y-1">
              {COMMON.map(mol => (
                <button
                  key={mol.name}
                  onClick={() => { setSmilesInput(mol.smiles); loadSMILES(mol.smiles); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm flex justify-between items-center group"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <span>{mol.name}</span>
                  <ZoomIn size={11} className="opacity-0 group-hover:opacity-100 text-blue-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Render Mode */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
              Render Mode
            </label>
            <div className="space-y-1">
              {RENDER_MODES.map(mode => (
                <button
                  key={mode.id}
                  onClick={() => handleRenderChange(mode.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                    renderMode === mode.id ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/5'
                  }`}
                  style={{
                    border: `1px solid ${renderMode === mode.id ? 'rgba(59,130,246,0.4)' : 'var(--border)'}`,
                    color: renderMode === mode.id ? '#60a5fa' : 'var(--text-secondary)',
                  }}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── 3D Viewer ── */}
        <div className="lg:col-span-2 glass-card overflow-hidden flex flex-col" style={{ minHeight: '400px' }}>
          <div
            className="flex items-center justify-between p-3 flex-shrink-0"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {molInfo?.name
                ? <>{molInfo.name} <span className="text-blue-400 font-mono">({molInfo.formula})</span></>
                : '3D Viewer'
              }
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={toggleSpin}
                className={`p-1.5 rounded-lg transition-colors ${isSpinning ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/10'}`}
                style={{ color: isSpinning ? '#60a5fa' : 'var(--text-muted)' }}
                title="Toggle spin"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={() => { navigator.clipboard.writeText(smilesInput); toast.success('SMILES copied!'); }}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                style={{ color: 'var(--text-muted)' }}
                title="Copy SMILES"
              >
                <Download size={14} />
              </button>
              <button
                onClick={() => toast.success('Molecule bookmarked!')}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                style={{ color: 'var(--text-muted)' }}
                title="Bookmark"
              >
                <Bookmark size={14} />
              </button>
            </div>
          </div>

          {/* The viewer container — IMPORTANT: must have explicit height */}
          <div className="flex-1 relative" style={{ minHeight: '300px' }}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10"
                style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}>
                <div className="flex flex-col items-center gap-2">
                  <div className="molecule-loader" />
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Loading 3D structure...</span>
                </div>
              </div>
            )}
            {!viewerReady && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="molecule-loader" />
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Initializing 3D engine...</span>
                </div>
              </div>
            )}
            {/* 3Dmol renders here — MUST be 100% width/height */}
            <div
              ref={viewerRef}
              style={{ width: '100%', height: '100%', minHeight: '300px', position: 'relative' }}
            />
          </div>
        </div>

        {/* ── Properties Panel ── */}
        <div className="glass-card p-4 space-y-4 overflow-y-auto">
          <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Info size={14} className="text-blue-400" /> Properties
          </h3>

          {molInfo ? (
            <div className="space-y-3">
              <PropRow label="IUPAC Name"   value={molInfo.name} />
              <PropRow label="Formula"      value={molInfo.formula} mono />
              <PropRow label="Mol. Weight"  value={`${molInfo.weight} g/mol`} />
              <PropRow label="SMILES"       value={smilesInput} mono small />
            </div>
          ) : (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Load a molecule to see its properties
            </p>
          )}

          {/* Atom Color Legend */}
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
              Atom Colors (CPK)
            </p>
            {[
              { el: 'C', color: '#909090', label: 'Carbon' },
              { el: 'H', color: '#e5e7eb', label: 'Hydrogen' },
              { el: 'O', color: '#ff4040', label: 'Oxygen' },
              { el: 'N', color: '#4040ff', label: 'Nitrogen' },
              { el: 'S', color: '#ffff30', label: 'Sulfur' },
              { el: 'P', color: '#ff8000', label: 'Phosphorus' },
            ].map(a => (
              <div key={a.el} className="flex items-center gap-2 py-1">
                <div className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0"
                  style={{ background: a.color }} />
                <span className="text-xs font-mono font-bold w-4" style={{ color: 'var(--text-primary)' }}>{a.el}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

function PropRow({ label, value, mono, small }: { label: string; value: string; mono?: boolean; small?: boolean }) {
  return (
    <div>
      <div className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</div>
      <div className={`break-all ${mono ? 'font-mono' : ''} ${small ? 'text-xs' : 'text-sm'} font-medium`}
        style={{ color: 'var(--text-primary)' }}>
        {value}
      </div>
    </div>
  );
}

export default function VisualizerPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="molecule-loader" />
      </div>
    }>
      <VisualizerContent />
    </Suspense>
  );
}
