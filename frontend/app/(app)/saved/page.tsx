'use client';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { useMoleculeStore } from '@/store/moleculeStore';
import { useRouter } from 'next/navigation';
import { Bookmark, Eye, Trash2, Copy, Atom } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SavedPage() {
  const { molecules, removeMolecule } = useMoleculeStore();
  const router = useRouter();

  const copy = (smiles: string) => {
    navigator.clipboard.writeText(smiles);
    toast.success('SMILES copied!');
  };

  return (
    <>
      <Header title="Saved Molecules" subtitle={`${molecules.length} molecule${molecules.length !== 1 ? 's' : ''} saved`} />
      <main className="p-6 pt-20">
        {molecules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4">
              <Bookmark size={32} style={{ color: 'var(--text-muted)' }} />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No saved molecules yet</h3>
            <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
              Visualize molecules and save them here for quick access
            </p>
            <button onClick={() => router.push('/visualizer')} className="btn-neon px-6 py-2 text-sm">
              Open Visualizer
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {molecules.map((mol, i) => (
              <motion.div
                key={mol.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-4 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <Atom size={20} className="text-blue-400" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => copy(mol.smiles)} className="p-1.5 rounded-lg hover:bg-white/10">
                      <Copy size={12} style={{ color: 'var(--text-muted)' }} />
                    </button>
                    <button onClick={() => removeMolecule(mol.id)} className="p-1.5 rounded-lg hover:bg-red-500/10">
                      <Trash2 size={12} className="text-red-400" />
                    </button>
                  </div>
                </div>
                <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{mol.name}</h3>
                <p className="text-xs font-mono mb-2" style={{ color: 'var(--text-muted)' }}>{mol.formula}</p>
                <p className="text-xs font-mono truncate mb-3" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>{mol.smiles}</p>
                <button
                  onClick={() => router.push(`/visualizer?smiles=${encodeURIComponent(mol.smiles)}`)}
                  className="w-full py-2 rounded-lg text-xs flex items-center justify-center gap-1 hover:bg-blue-500/20 transition-colors"
                  style={{ border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' }}
                >
                  <Eye size={12} /> View 3D
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
