'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { BookOpen, Plus, Search, Tag, Trash2, FileText, Atom, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ResearchItem {
  id: string;
  type: 'note' | 'molecule' | 'reaction';
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}

const SAMPLE_ITEMS: ResearchItem[] = [
  {
    id: '1', type: 'note',
    title: 'Aspirin Mechanism of Action',
    content: 'Aspirin (acetylsalicylic acid) irreversibly inhibits cyclooxygenase (COX-1 and COX-2) enzymes, blocking prostaglandin synthesis. This mechanism accounts for its anti-inflammatory, analgesic, and antipyretic effects.',
    tags: ['pharmacology', 'nsaid', 'mechanism'],
    createdAt: '2024-01-15',
  },
  {
    id: '2', type: 'molecule',
    title: 'Caffeine Structure Analysis',
    content: 'Caffeine (C₈H₁₀N₄O₂) is a xanthine alkaloid. SMILES: Cn1cnc2c1c(=O)n(c(=O)n2C)C. Contains a purine scaffold with three methyl groups. Molecular weight: 194.19 g/mol.',
    tags: ['alkaloid', 'stimulant', 'purine'],
    createdAt: '2024-01-20',
  },
  {
    id: '3', type: 'reaction',
    title: 'Fischer Esterification',
    content: 'Carboxylic acid + alcohol → ester + water (acid catalyst). Example: Acetic acid + Ethanol → Ethyl acetate + H₂O. The reaction is reversible and reaches equilibrium. Le Chatelier\'s principle can drive it forward.',
    tags: ['esterification', 'organic', 'synthesis'],
    createdAt: '2024-01-22',
  },
];

export default function ResearchPage() {
  const [items, setItems] = useState<ResearchItem[]>(SAMPLE_ITEMS);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', content: '', tags: '', type: 'note' as const });

  const allTags = Array.from(new Set(items.flatMap((i) => i.tags)));

  const filtered = items.filter((item) => {
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase());
    const matchTag = !activeTag || item.tags.includes(activeTag);
    return matchSearch && matchTag;
  });

  const addItem = () => {
    if (!newItem.title.trim()) { toast.error('Title is required'); return; }
    const item: ResearchItem = {
      id: Date.now().toString(),
      type: newItem.type,
      title: newItem.title,
      content: newItem.content,
      tags: newItem.tags.split(',').map((t) => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setItems((prev) => [item, ...prev]);
    setNewItem({ title: '', content: '', tags: '', type: 'note' });
    setShowAdd(false);
    toast.success('Research item saved!');
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success('Item deleted');
  };

  const typeIcon = (type: string) => {
    if (type === 'molecule') return <Atom size={14} className="text-blue-400" />;
    if (type === 'reaction') return <FileText size={14} className="text-purple-400" />;
    return <BookOpen size={14} className="text-teal-400" />;
  };

  const typeColor = (type: string) => {
    if (type === 'molecule') return 'rgba(59,130,246,0.1)';
    if (type === 'reaction') return 'rgba(168,85,247,0.1)';
    return 'rgba(20,184,166,0.1)';
  };

  return (
    <>
      <Header title="Research Library" subtitle="Save and organize your chemistry notes" />
      <main className="p-6 pt-20 space-y-5">

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl input-neon flex-1 min-w-48">
            <Search size={14} style={{ color: 'var(--text-muted)' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your research..."
              className="bg-transparent text-sm outline-none flex-1"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowAdd(true)}
            className="btn-neon flex items-center gap-2 px-4 py-2 text-sm"
          >
            <Plus size={14} /> Add Note
          </motion.button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-3 py-1 rounded-full text-xs transition-colors ${
              !activeTag ? 'bg-blue-500 text-white' : 'hover:bg-white/10'
            }`}
            style={{ border: '1px solid var(--border)', color: !activeTag ? 'white' : 'var(--text-secondary)' }}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 transition-colors ${
                activeTag === tag ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/5'
              }`}
              style={{ border: `1px solid ${activeTag === tag ? 'rgba(59,130,246,0.4)' : 'var(--border)'}`, color: activeTag === tag ? '#60a5fa' : 'var(--text-secondary)' }}
            >
              <Tag size={10} /> {tag}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: typeColor(item.type) }}>
                    {typeIcon(item.type)}
                  </div>
                  <span className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>{item.type}</span>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={13} className="text-red-400" />
                </button>
              </div>

              <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
              <p className="text-xs leading-relaxed mb-3 line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                {item.content}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full text-xs"
                      style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.createdAt}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <BookOpen size={40} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-muted)' }} />
            <p style={{ color: 'var(--text-muted)' }}>No research items found</p>
          </div>
        )}

        {/* Add Modal */}
        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="glass-card p-6 w-full max-w-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Add Research Note</h3>
                  <button onClick={() => setShowAdd(false)}><X size={16} style={{ color: 'var(--text-muted)' }} /></button>
                </div>
                <div className="space-y-3">
                  <select
                    value={newItem.type}
                    onChange={(e) => setNewItem((p) => ({ ...p, type: e.target.value as 'note' }))}
                    className="input-neon w-full px-3 py-2 rounded-xl text-sm"
                  >
                    <option value="note">Note</option>
                    <option value="molecule">Molecule</option>
                    <option value="reaction">Reaction</option>
                  </select>
                  <input
                    value={newItem.title}
                    onChange={(e) => setNewItem((p) => ({ ...p, title: e.target.value }))}
                    placeholder="Title *"
                    className="input-neon w-full px-3 py-2 rounded-xl text-sm"
                  />
                  <textarea
                    value={newItem.content}
                    onChange={(e) => setNewItem((p) => ({ ...p, content: e.target.value }))}
                    placeholder="Content..."
                    rows={4}
                    className="input-neon w-full px-3 py-2 rounded-xl text-sm resize-none"
                  />
                  <input
                    value={newItem.tags}
                    onChange={(e) => setNewItem((p) => ({ ...p, tags: e.target.value }))}
                    placeholder="Tags (comma separated)"
                    className="input-neon w-full px-3 py-2 rounded-xl text-sm"
                  />
                  <div className="flex gap-3">
                    <button onClick={() => setShowAdd(false)}
                      className="flex-1 px-4 py-2 rounded-xl text-sm"
                      style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                      Cancel
                    </button>
                    <button onClick={addItem} className="btn-neon flex-1 py-2 text-sm">Save</button>
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
