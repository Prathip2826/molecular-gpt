'use client';
import { motion } from 'framer-motion';
import { Eye, Bookmark, Copy, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getMoleculeColor, truncateSMILES } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Molecule } from '@/types';

interface MoleculeCardProps {
  molecule: Molecule;
  onSave?: (mol: Molecule) => void;
  delay?: number;
  showActions?: boolean;
}

export function MoleculeCard({ molecule, onSave, delay = 0, showActions = true }: MoleculeCardProps) {
  const router = useRouter();
  const color = getMoleculeColor(molecule.name);

  const handleView = () => {
    router.push(`/visualizer?smiles=${encodeURIComponent(molecule.smiles)}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(molecule.smiles);
    toast.success('SMILES copied!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -3, scale: 1.01 }}
      className="glass-card p-4 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          style={{ background: color }}
        >
          {molecule.name.charAt(0).toUpperCase()}
        </div>

        {showActions && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title="Copy SMILES"
            >
              <Copy size={12} style={{ color: 'var(--text-muted)' }} />
            </button>
            {onSave && (
              <button
                onClick={() => onSave(molecule)}
                className="p-1.5 rounded-lg hover:bg-blue-500/10 transition-colors"
                title="Save molecule"
              >
                <Bookmark size={12} className="text-blue-400" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <h3 className="text-sm font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>
        {molecule.name}
      </h3>
      {molecule.formula && (
        <p className="text-xs font-mono mb-1" style={{ color: 'var(--text-muted)' }}>
          {molecule.formula}
        </p>
      )}
      {molecule.properties?.molecularWeight && (
        <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
          MW: {molecule.properties.molecularWeight.toFixed(2)} g/mol
        </p>
      )}

      {/* SMILES Preview */}
      <div
        className="text-xs font-mono p-2 rounded-lg mb-3 truncate"
        style={{ background: 'var(--bg-secondary)', color: '#22d3ee' }}
        title={molecule.smiles}
      >
        {truncateSMILES(molecule.smiles, 28)}
      </div>

      {/* Tags */}
      {molecule.tags && molecule.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {molecule.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-xs"
              style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* View Button */}
      <button
        onClick={handleView}
        className="w-full py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all hover:gap-2.5"
        style={{ background: `${color}15`, border: `1px solid ${color}40`, color }}
      >
        <Eye size={12} /> View 3D
      </button>
    </motion.div>
  );
}

// Compact row version
interface MoleculeRowProps {
  name: string;
  formula?: string;
  smiles: string;
  onClick?: () => void;
  delay?: number;
}

export function MoleculeRow({ name, formula, smiles, onClick, delay = 0 }: MoleculeRowProps) {
  const color = getMoleculeColor(name);
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      whileHover={{ x: 4 }}
      onClick={onClick}
      className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-white/5 transition-colors"
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
        style={{ background: color }}
      >
        {name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{name}</div>
        {formula && <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{formula}</div>}
      </div>
      <ExternalLink size={12} style={{ color: 'var(--text-muted)' }} className="flex-shrink-0" />
    </motion.div>
  );
}
