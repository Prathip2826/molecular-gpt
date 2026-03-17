'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { pubchemApi } from '@/lib/api';

interface SearchResult {
  name: string;
  smiles: string;
  formula: string;
}

const QUICK_SEARCHES = ['Aspirin', 'Caffeine', 'Glucose', 'Ibuprofen', 'Benzene', 'Paracetamol'];

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await pubchemApi.searchByName(query);
        const props = data.PropertyTable?.Properties?.slice(0, 5) || [];
        setResults(props.map((p: { IUPACName?: string; CanonicalSMILES: string; MolecularFormula: string }) => ({
          name: p.IUPACName || query,
          smiles: p.CanonicalSMILES,
          formula: p.MolecularFormula,
        })));
      } catch { setResults([]); }
      finally { setIsLoading(false); }
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSelect = (smiles: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/visualizer?smiles=${encodeURIComponent(smiles)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setIsOpen(false); setQuery(''); }
    if (e.key === 'Enter' && query) {
      router.push(`/chat?q=${encodeURIComponent(`Tell me about ${query}`)}`);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl input-neon">
        <Search size={15} style={{ color: 'var(--text-muted)' }} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search molecules..."
          className="bg-transparent text-sm flex-1 outline-none"
          style={{ color: 'var(--text-primary)' }}
        />
        {isLoading && <Loader2 size={13} className="animate-spin text-blue-400 flex-shrink-0" />}
        {query && !isLoading && (
          <button onClick={() => { setQuery(''); setResults([]); }}>
            <X size={13} style={{ color: 'var(--text-muted)' }} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (query || results.length === 0) && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 right-0 rounded-xl overflow-hidden z-50"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            }}
          >
            {/* Quick searches when empty */}
            {!query && (
              <div className="p-3">
                <p className="text-xs mb-2 px-1" style={{ color: 'var(--text-muted)' }}>Quick search</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_SEARCHES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="px-3 py-1 rounded-lg text-xs hover:bg-white/10 transition-colors"
                      style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search results */}
            {results.length > 0 && (
              <div className="py-1">
                {results.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(r.smiles)}
                    className="w-full text-left px-4 py-2.5 hover:bg-white/5 transition-colors flex items-center gap-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400 flex-shrink-0">
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{r.name}</div>
                      <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{r.formula}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {query && results.length === 0 && !isLoading && (
              <div className="px-4 py-3 text-sm text-center" style={{ color: 'var(--text-muted)' }}>
                No molecules found. Press Enter to ask AI.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
