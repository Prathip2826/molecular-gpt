'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { useRouter } from 'next/navigation';
import { DRUGS, type Drug } from '@/lib/drugs';
import { Search, Eye, MessageSquare, X, Pill } from 'lucide-react';

export default function PharmacologyPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Drug | null>(null);
  const [category, setCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(DRUGS.map(d => d.category)))];

  const filtered = DRUGS.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase()) ||
      d.uses.some(u => u.toLowerCase().includes(search.toLowerCase()));
    const matchCat = category === 'All' || d.category === category;
    return matchSearch && matchCat;
  });

  return (
    <>
      <Header title="Drug Library" subtitle="Pharmacology & Molecular Medicine" />
      <main className="p-6 pt-20 space-y-6">

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search drugs, uses, categories..."
              className="input-neon w-full pl-9 pr-4 py-2.5 rounded-xl text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="px-3 py-2 rounded-xl text-xs whitespace-nowrap transition-all flex-shrink-0"
                style={{
                  background: category === cat ? 'rgba(99,102,241,0.2)' : 'var(--bg-glass)',
                  border: `1px solid ${category === cat ? 'rgba(99,102,241,0.5)' : 'var(--border)'}`,
                  color: category === cat ? '#818cf8' : 'var(--text-secondary)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Drug Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((drug, i) => (
            <motion.div
              key={drug.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={() => setSelected(drug)}
              className="glass-card p-4 cursor-pointer group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${drug.color} flex items-center justify-center text-lg`}>
                  {drug.emoji}
                </div>
                <span className="text-xs px-2 py-1 rounded-lg" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                  {drug.category}
                </span>
              </div>

              {/* Info */}
              <h3 className="text-sm font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{drug.name}</h3>
              <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{drug.genericName}</p>
              <p className="text-xs font-mono mb-3" style={{ color: 'var(--text-muted)' }}>{drug.formula} · {drug.mw}</p>

              {/* Uses */}
              <div className="flex flex-wrap gap-1 mb-3">
                {drug.uses.slice(0, 2).map(use => (
                  <span key={use} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                    {use}
                  </span>
                ))}
                {drug.uses.length > 2 && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                    +{drug.uses.length - 2}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); router.push(`/visualizer?smiles=${encodeURIComponent(drug.smiles)}`); }}
                  className="flex-1 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 hover:bg-blue-500/20 transition-colors"
                  style={{ border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' }}
                >
                  <Eye size={11} /> 3D View
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); router.push(`/chat?q=${encodeURIComponent(`Explain ${drug.name} mechanism of action`)}`); }}
                  className="flex-1 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 hover:bg-purple-500/20 transition-colors"
                  style={{ border: '1px solid rgba(168,85,247,0.3)', color: '#c084fc' }}
                >
                  <MessageSquare size={11} /> Ask AI
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Drug Detail Modal */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="glass-card p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selected.color} flex items-center justify-center text-2xl`}>
                      {selected.emoji}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{selected.name}</h2>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{selected.genericName}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-white/10" style={{ color: 'var(--text-muted)' }}>
                    <X size={16} />
                  </button>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                      <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Category</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{selected.category}</p>
                    </div>
                    <div className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                      <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Molecular Weight</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{selected.mw}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <p className="text-xs mb-2 font-medium" style={{ color: 'var(--text-muted)' }}>Mechanism of Action</p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{selected.mechanism}</p>
                  </div>

                  <div className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <p className="text-xs mb-2 font-medium" style={{ color: 'var(--text-muted)' }}>Clinical Uses</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.uses.map(use => (
                        <span key={use} className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <p className="text-xs mb-2 font-medium" style={{ color: 'var(--text-muted)' }}>Side Effects</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.sideEffects.map(se => (
                        <span key={se} className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                          {se}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <p className="text-xs mb-1 font-medium" style={{ color: 'var(--text-muted)' }}>SMILES</p>
                    <p className="text-xs font-mono break-all" style={{ color: 'var(--text-secondary)' }}>{selected.smiles}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => router.push(`/visualizer?smiles=${encodeURIComponent(selected.smiles)}`)}
                      className="flex-1 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 btn-neon"
                    >
                      <Eye size={14} /> View 3D Structure
                    </button>
                    <button
                      onClick={() => router.push(`/chat?q=${encodeURIComponent(`Explain ${selected.name} pharmacology, mechanism and clinical uses in detail`)}`)}
                      className="flex-1 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
                      style={{ background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.4)', color: '#c084fc' }}
                    >
                      <MessageSquare size={14} /> Ask AI
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </>
  );
}
