'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { useRouter } from 'next/navigation';
import { X, MessageSquare, Eye } from 'lucide-react';

const ELEMENTS = [
  // Period 1
  { number: 1,   symbol: 'H',  name: 'Hydrogen',      mass: 1.008,    category: 'nonmetal',        period: 1, group: 1,  color: '#60a5fa', smiles: '[H][H]' },
  { number: 2,   symbol: 'He', name: 'Helium',         mass: 4.003,    category: 'noble-gas',       period: 1, group: 18, color: '#c084fc', smiles: '[He]' },
  // Period 2
  { number: 3,   symbol: 'Li', name: 'Lithium',        mass: 6.941,    category: 'alkali-metal',    period: 2, group: 1,  color: '#f87171', smiles: '[Li]' },
  { number: 4,   symbol: 'Be', name: 'Beryllium',      mass: 9.012,    category: 'alkaline-earth',  period: 2, group: 2,  color: '#fb923c', smiles: '[Be]' },
  { number: 5,   symbol: 'B',  name: 'Boron',          mass: 10.81,    category: 'metalloid',       period: 2, group: 13, color: '#84cc16', smiles: '[B]' },
  { number: 6,   symbol: 'C',  name: 'Carbon',         mass: 12.011,   category: 'nonmetal',        period: 2, group: 14, color: '#60a5fa', smiles: 'C' },
  { number: 7,   symbol: 'N',  name: 'Nitrogen',       mass: 14.007,   category: 'nonmetal',        period: 2, group: 15, color: '#60a5fa', smiles: 'N' },
  { number: 8,   symbol: 'O',  name: 'Oxygen',         mass: 15.999,   category: 'nonmetal',        period: 2, group: 16, color: '#60a5fa', smiles: 'O' },
  { number: 9,   symbol: 'F',  name: 'Fluorine',       mass: 18.998,   category: 'halogen',         period: 2, group: 17, color: '#34d399', smiles: 'F' },
  { number: 10,  symbol: 'Ne', name: 'Neon',           mass: 20.180,   category: 'noble-gas',       period: 2, group: 18, color: '#c084fc', smiles: '[Ne]' },
  // Period 3
  { number: 11,  symbol: 'Na', name: 'Sodium',         mass: 22.990,   category: 'alkali-metal',    period: 3, group: 1,  color: '#f87171', smiles: '[Na]' },
  { number: 12,  symbol: 'Mg', name: 'Magnesium',      mass: 24.305,   category: 'alkaline-earth',  period: 3, group: 2,  color: '#fb923c', smiles: '[Mg]' },
  { number: 13,  symbol: 'Al', name: 'Aluminum',       mass: 26.982,   category: 'post-transition', period: 3, group: 13, color: '#a78bfa', smiles: '[Al]' },
  { number: 14,  symbol: 'Si', name: 'Silicon',        mass: 28.086,   category: 'metalloid',       period: 3, group: 14, color: '#84cc16', smiles: '[Si]' },
  { number: 15,  symbol: 'P',  name: 'Phosphorus',     mass: 30.974,   category: 'nonmetal',        period: 3, group: 15, color: '#60a5fa', smiles: 'P' },
  { number: 16,  symbol: 'S',  name: 'Sulfur',         mass: 32.06,    category: 'nonmetal',        period: 3, group: 16, color: '#60a5fa', smiles: 'S' },
  { number: 17,  symbol: 'Cl', name: 'Chlorine',       mass: 35.45,    category: 'halogen',         period: 3, group: 17, color: '#34d399', smiles: '[Cl]' },
  { number: 18,  symbol: 'Ar', name: 'Argon',          mass: 39.948,   category: 'noble-gas',       period: 3, group: 18, color: '#c084fc', smiles: '[Ar]' },
  // Period 4
  { number: 19,  symbol: 'K',  name: 'Potassium',      mass: 39.098,   category: 'alkali-metal',    period: 4, group: 1,  color: '#f87171', smiles: '[K]' },
  { number: 20,  symbol: 'Ca', name: 'Calcium',        mass: 40.078,   category: 'alkaline-earth',  period: 4, group: 2,  color: '#fb923c', smiles: '[Ca]' },
  { number: 21,  symbol: 'Sc', name: 'Scandium',       mass: 44.956,   category: 'transition',      period: 4, group: 3,  color: '#fbbf24', smiles: '[Sc]' },
  { number: 22,  symbol: 'Ti', name: 'Titanium',       mass: 47.867,   category: 'transition',      period: 4, group: 4,  color: '#fbbf24', smiles: '[Ti]' },
  { number: 23,  symbol: 'V',  name: 'Vanadium',       mass: 50.942,   category: 'transition',      period: 4, group: 5,  color: '#fbbf24', smiles: '[V]' },
  { number: 24,  symbol: 'Cr', name: 'Chromium',       mass: 51.996,   category: 'transition',      period: 4, group: 6,  color: '#fbbf24', smiles: '[Cr]' },
  { number: 25,  symbol: 'Mn', name: 'Manganese',      mass: 54.938,   category: 'transition',      period: 4, group: 7,  color: '#fbbf24', smiles: '[Mn]' },
  { number: 26,  symbol: 'Fe', name: 'Iron',           mass: 55.845,   category: 'transition',      period: 4, group: 8,  color: '#fbbf24', smiles: '[Fe]' },
  { number: 27,  symbol: 'Co', name: 'Cobalt',         mass: 58.933,   category: 'transition',      period: 4, group: 9,  color: '#fbbf24', smiles: '[Co]' },
  { number: 28,  symbol: 'Ni', name: 'Nickel',         mass: 58.693,   category: 'transition',      period: 4, group: 10, color: '#fbbf24', smiles: '[Ni]' },
  { number: 29,  symbol: 'Cu', name: 'Copper',         mass: 63.546,   category: 'transition',      period: 4, group: 11, color: '#fbbf24', smiles: '[Cu]' },
  { number: 30,  symbol: 'Zn', name: 'Zinc',           mass: 65.38,    category: 'transition',      period: 4, group: 12, color: '#fbbf24', smiles: '[Zn]' },
  { number: 31,  symbol: 'Ga', name: 'Gallium',        mass: 69.723,   category: 'post-transition', period: 4, group: 13, color: '#a78bfa', smiles: '[Ga]' },
  { number: 32,  symbol: 'Ge', name: 'Germanium',      mass: 72.630,   category: 'metalloid',       period: 4, group: 14, color: '#84cc16', smiles: '[Ge]' },
  { number: 33,  symbol: 'As', name: 'Arsenic',        mass: 74.922,   category: 'metalloid',       period: 4, group: 15, color: '#84cc16', smiles: '[As]' },
  { number: 34,  symbol: 'Se', name: 'Selenium',       mass: 78.971,   category: 'nonmetal',        period: 4, group: 16, color: '#60a5fa', smiles: '[Se]' },
  { number: 35,  symbol: 'Br', name: 'Bromine',        mass: 79.904,   category: 'halogen',         period: 4, group: 17, color: '#34d399', smiles: '[Br]' },
  { number: 36,  symbol: 'Kr', name: 'Krypton',        mass: 83.798,   category: 'noble-gas',       period: 4, group: 18, color: '#c084fc', smiles: '[Kr]' },
  // Period 5
  { number: 37,  symbol: 'Rb', name: 'Rubidium',       mass: 85.468,   category: 'alkali-metal',    period: 5, group: 1,  color: '#f87171', smiles: '[Rb]' },
  { number: 38,  symbol: 'Sr', name: 'Strontium',      mass: 87.62,    category: 'alkaline-earth',  period: 5, group: 2,  color: '#fb923c', smiles: '[Sr]' },
  { number: 39,  symbol: 'Y',  name: 'Yttrium',        mass: 88.906,   category: 'transition',      period: 5, group: 3,  color: '#fbbf24', smiles: '[Y]' },
  { number: 40,  symbol: 'Zr', name: 'Zirconium',      mass: 91.224,   category: 'transition',      period: 5, group: 4,  color: '#fbbf24', smiles: '[Zr]' },
  { number: 41,  symbol: 'Nb', name: 'Niobium',        mass: 92.906,   category: 'transition',      period: 5, group: 5,  color: '#fbbf24', smiles: '[Nb]' },
  { number: 42,  symbol: 'Mo', name: 'Molybdenum',     mass: 95.95,    category: 'transition',      period: 5, group: 6,  color: '#fbbf24', smiles: '[Mo]' },
  { number: 43,  symbol: 'Tc', name: 'Technetium',     mass: 98,       category: 'transition',      period: 5, group: 7,  color: '#fbbf24', smiles: '[Tc]' },
  { number: 44,  symbol: 'Ru', name: 'Ruthenium',      mass: 101.07,   category: 'transition',      period: 5, group: 8,  color: '#fbbf24', smiles: '[Ru]' },
  { number: 45,  symbol: 'Rh', name: 'Rhodium',        mass: 102.91,   category: 'transition',      period: 5, group: 9,  color: '#fbbf24', smiles: '[Rh]' },
  { number: 46,  symbol: 'Pd', name: 'Palladium',      mass: 106.42,   category: 'transition',      period: 5, group: 10, color: '#fbbf24', smiles: '[Pd]' },
  { number: 47,  symbol: 'Ag', name: 'Silver',         mass: 107.87,   category: 'transition',      period: 5, group: 11, color: '#fbbf24', smiles: '[Ag]' },
  { number: 48,  symbol: 'Cd', name: 'Cadmium',        mass: 112.41,   category: 'transition',      period: 5, group: 12, color: '#fbbf24', smiles: '[Cd]' },
  { number: 49,  symbol: 'In', name: 'Indium',         mass: 114.82,   category: 'post-transition', period: 5, group: 13, color: '#a78bfa', smiles: '[In]' },
  { number: 50,  symbol: 'Sn', name: 'Tin',            mass: 118.71,   category: 'post-transition', period: 5, group: 14, color: '#a78bfa', smiles: '[Sn]' },
  { number: 51,  symbol: 'Sb', name: 'Antimony',       mass: 121.76,   category: 'metalloid',       period: 5, group: 15, color: '#84cc16', smiles: '[Sb]' },
  { number: 52,  symbol: 'Te', name: 'Tellurium',      mass: 127.60,   category: 'metalloid',       period: 5, group: 16, color: '#84cc16', smiles: '[Te]' },
  { number: 53,  symbol: 'I',  name: 'Iodine',         mass: 126.90,   category: 'halogen',         period: 5, group: 17, color: '#34d399', smiles: '[I]' },
  { number: 54,  symbol: 'Xe', name: 'Xenon',          mass: 131.29,   category: 'noble-gas',       period: 5, group: 18, color: '#c084fc', smiles: '[Xe]' },
  // Period 6
  { number: 55,  symbol: 'Cs', name: 'Cesium',         mass: 132.91,   category: 'alkali-metal',    period: 6, group: 1,  color: '#f87171', smiles: '[Cs]' },
  { number: 56,  symbol: 'Ba', name: 'Barium',         mass: 137.33,   category: 'alkaline-earth',  period: 6, group: 2,  color: '#fb923c', smiles: '[Ba]' },
  { number: 72,  symbol: 'Hf', name: 'Hafnium',        mass: 178.49,   category: 'transition',      period: 6, group: 4,  color: '#fbbf24', smiles: '[Hf]' },
  { number: 73,  symbol: 'Ta', name: 'Tantalum',       mass: 180.95,   category: 'transition',      period: 6, group: 5,  color: '#fbbf24', smiles: '[Ta]' },
  { number: 74,  symbol: 'W',  name: 'Tungsten',       mass: 183.84,   category: 'transition',      period: 6, group: 6,  color: '#fbbf24', smiles: '[W]' },
  { number: 75,  symbol: 'Re', name: 'Rhenium',        mass: 186.21,   category: 'transition',      period: 6, group: 7,  color: '#fbbf24', smiles: '[Re]' },
  { number: 76,  symbol: 'Os', name: 'Osmium',         mass: 190.23,   category: 'transition',      period: 6, group: 8,  color: '#fbbf24', smiles: '[Os]' },
  { number: 77,  symbol: 'Ir', name: 'Iridium',        mass: 192.22,   category: 'transition',      period: 6, group: 9,  color: '#fbbf24', smiles: '[Ir]' },
  { number: 78,  symbol: 'Pt', name: 'Platinum',       mass: 195.08,   category: 'transition',      period: 6, group: 10, color: '#fbbf24', smiles: '[Pt]' },
  { number: 79,  symbol: 'Au', name: 'Gold',           mass: 196.97,   category: 'transition',      period: 6, group: 11, color: '#fbbf24', smiles: '[Au]' },
  { number: 80,  symbol: 'Hg', name: 'Mercury',        mass: 200.59,   category: 'transition',      period: 6, group: 12, color: '#fbbf24', smiles: '[Hg]' },
  { number: 81,  symbol: 'Tl', name: 'Thallium',       mass: 204.38,   category: 'post-transition', period: 6, group: 13, color: '#a78bfa', smiles: '[Tl]' },
  { number: 82,  symbol: 'Pb', name: 'Lead',           mass: 207.2,    category: 'post-transition', period: 6, group: 14, color: '#a78bfa', smiles: '[Pb]' },
  { number: 83,  symbol: 'Bi', name: 'Bismuth',        mass: 208.98,   category: 'post-transition', period: 6, group: 15, color: '#a78bfa', smiles: '[Bi]' },
  { number: 84,  symbol: 'Po', name: 'Polonium',       mass: 209,      category: 'metalloid',       period: 6, group: 16, color: '#84cc16', smiles: '[Po]' },
  { number: 85,  symbol: 'At', name: 'Astatine',       mass: 210,      category: 'halogen',         period: 6, group: 17, color: '#34d399', smiles: '[At]' },
  { number: 86,  symbol: 'Rn', name: 'Radon',          mass: 222,      category: 'noble-gas',       period: 6, group: 18, color: '#c084fc', smiles: '[Rn]' },
  // Period 7
  { number: 87,  symbol: 'Fr', name: 'Francium',       mass: 223,      category: 'alkali-metal',    period: 7, group: 1,  color: '#f87171', smiles: '[Fr]' },
  { number: 88,  symbol: 'Ra', name: 'Radium',         mass: 226,      category: 'alkaline-earth',  period: 7, group: 2,  color: '#fb923c', smiles: '[Ra]' },
  { number: 104, symbol: 'Rf', name: 'Rutherfordium',  mass: 267,      category: 'transition',      period: 7, group: 4,  color: '#fbbf24', smiles: '[Rf]' },
  { number: 105, symbol: 'Db', name: 'Dubnium',        mass: 268,      category: 'transition',      period: 7, group: 5,  color: '#fbbf24', smiles: '[Db]' },
  { number: 106, symbol: 'Sg', name: 'Seaborgium',     mass: 269,      category: 'transition',      period: 7, group: 6,  color: '#fbbf24', smiles: '[Sg]' },
  { number: 107, symbol: 'Bh', name: 'Bohrium',        mass: 270,      category: 'transition',      period: 7, group: 7,  color: '#fbbf24', smiles: '[Bh]' },
  { number: 108, symbol: 'Hs', name: 'Hassium',        mass: 269,      category: 'transition',      period: 7, group: 8,  color: '#fbbf24', smiles: '[Hs]' },
  { number: 118, symbol: 'Og', name: 'Oganesson',      mass: 294,      category: 'noble-gas',       period: 7, group: 18, color: '#c084fc', smiles: '[Og]' },
];

const CATEGORY_COLORS: Record<string, { bg: string; border: string; label: string }> = {
  'alkali-metal':    { bg: 'rgba(248,113,113,0.15)', border: '#f87171', label: 'Alkali Metal' },
  'alkaline-earth':  { bg: 'rgba(251,146,60,0.15)',  border: '#fb923c', label: 'Alkaline Earth' },
  'transition':      { bg: 'rgba(251,191,36,0.15)',  border: '#fbbf24', label: 'Transition Metal' },
  'post-transition': { bg: 'rgba(167,139,250,0.15)', border: '#a78bfa', label: 'Post-Transition' },
  'metalloid':       { bg: 'rgba(132,204,22,0.15)',  border: '#84cc16', label: 'Metalloid' },
  'nonmetal':        { bg: 'rgba(96,165,250,0.15)',  border: '#60a5fa', label: 'Nonmetal' },
  'halogen':         { bg: 'rgba(52,211,153,0.15)',  border: '#34d399', label: 'Halogen' },
  'noble-gas':       { bg: 'rgba(192,132,252,0.15)', border: '#c084fc', label: 'Noble Gas' },
};

type Element = typeof ELEMENTS[0];

export default function PeriodicTablePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Element | null>(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = ELEMENTS.filter(el => {
    const matchFilter = filter === 'all' || el.category === filter;
    const matchSearch = !search ||
      el.name.toLowerCase().includes(search.toLowerCase()) ||
      el.symbol.toLowerCase().includes(search.toLowerCase()) ||
      el.number.toString().includes(search);
    return matchFilter && matchSearch;
  });

  const getElement = (period: number, group: number) =>
    filtered.find(el => el.period === period && el.group === group);

  const periods = [1, 2, 3, 4, 5, 6, 7];
  const groups  = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  return (
    <>
      <Header title="Periodic Table" subtitle="Interactive Element Explorer" />
      <main className="p-4 pt-20 pb-12 space-y-4">

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search element name, symbol or number..."
            className="input-neon flex-1 px-4 py-2.5 rounded-xl text-sm"
          />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="input-neon px-3 py-2.5 rounded-xl text-sm"
            style={{ color: 'var(--text-primary)', background: 'var(--bg-glass)' }}
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORY_COLORS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORY_COLORS).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setFilter(filter === k ? 'all' : k)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all"
              style={{
                background: filter === k || filter === 'all' ? v.bg : 'transparent',
                border: `1px solid ${filter === k || filter === 'all' ? v.border : 'var(--border)'}`,
                color: filter === k || filter === 'all' ? v.border : 'var(--text-muted)',
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: v.border }} />
              {v.label}
            </button>
          ))}
        </div>

        {/* Periodic Table Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[900px]">
            {/* Group numbers */}
            <div className="grid mb-1" style={{ gridTemplateColumns: 'repeat(18, minmax(48px, 1fr))', gap: '2px' }}>
              {groups.map(g => (
                <div key={g} className="text-center text-xs py-0.5" style={{ color: 'var(--text-muted)' }}>{g}</div>
              ))}
            </div>

            {/* Rows */}
            {periods.map(period => (
              <div key={period} className="grid mb-0.5" style={{ gridTemplateColumns: 'repeat(18, minmax(48px, 1fr))', gap: '2px' }}>
                {groups.map(group => {
                  const el = getElement(period, group);
                  const cat = el ? CATEGORY_COLORS[el.category] : null;
                  const isSelected = selected?.number === el?.number;

                  if (!el) return <div key={group} />;

                  return (
                    <motion.button
                      key={group}
                      whileHover={{ scale: 1.15, zIndex: 10 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelected(el)}
                      className="relative rounded-lg p-1 text-center transition-all cursor-pointer"
                      style={{
                        background: isSelected ? cat?.border + '40' : cat?.bg,
                        border: `1px solid ${isSelected ? cat?.border : cat?.border + '60'}`,
                        boxShadow: isSelected ? `0 0 12px ${cat?.border}60` : 'none',
                      }}
                    >
                      <div className="text-xs leading-none mb-0.5" style={{ color: 'var(--text-muted)', fontSize: '9px' }}>
                        {el.number}
                      </div>
                      <div className="font-bold text-sm leading-none" style={{ color: cat?.border }}>
                        {el.symbol}
                      </div>
                      <div className="leading-none mt-0.5" style={{ color: 'var(--text-muted)', fontSize: '8px' }}>
                        {el.mass.toFixed(0)}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Element Detail Modal */}
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
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="glass-card p-6 max-w-sm w-full"
              >
                {/* Big Element Card */}
                {(() => {
                  const cat = CATEGORY_COLORS[selected.category];
                  return (
                    <>
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center"
                          style={{ background: cat.bg, border: `2px solid ${cat.border}` }}>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{selected.number}</div>
                          <div className="text-4xl font-black" style={{ color: cat.border }}>{selected.symbol}</div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{selected.mass}</div>
                        </div>
                        <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-white/10" style={{ color: 'var(--text-muted)' }}>
                          <X size={16} />
                        </button>
                      </div>

                      <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{selected.name}</h2>
                      <p className="text-sm mb-4 px-2 py-1 rounded-lg inline-block" style={{ background: cat.bg, color: cat.border, border: `1px solid ${cat.border}` }}>
                        {CATEGORY_COLORS[selected.category].label}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {[
                          { label: 'Atomic Number', value: selected.number },
                          { label: 'Atomic Mass',   value: `${selected.mass} u` },
                          { label: 'Period',         value: selected.period },
                          { label: 'Group',          value: selected.group },
                        ].map(row => (
                          <div key={row.label} className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                            <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{row.label}</div>
                            <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{row.value}</div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/chat?q=${encodeURIComponent(`Tell me about ${selected.name} element - properties, uses, discovery and interesting facts`)}`)}
                          className="flex-1 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 btn-neon"
                        >
                          <MessageSquare size={12} /> Ask AI
                        </button>
                        <button
                          onClick={() => router.push(`/visualizer?smiles=${encodeURIComponent(selected.smiles)}`)}
                          className="flex-1 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5"
                          style={{ background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.4)', color: '#c084fc' }}
                        >
                          <Eye size={12} /> Visualize
                        </button>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </>
  );
}
