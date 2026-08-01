'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import {
  Atom, MessageSquare, FlaskConical, Eye, TrendingUp,
  Zap, BookOpen, ChevronRight, Activity, Beaker,
  Shield, Search, Star, Clock, BarChart2, Flame,
  Pill, Dna, ArrowUpRight,
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { DRUGS } from '@/lib/drugs';

const STATS = [
  { label: 'Molecules in PubChem', value: '118M+', icon: Atom, color: '#3b82f6' },
  { label: 'AI Models Available', value: '10+', icon: Zap, color: '#a855f7' },
  { label: 'Research Papers', value: '35M+', icon: BookOpen, color: '#14b8a6' },
  { label: 'Active Users', value: '∞', icon: Activity, color: '#f59e0b' },
];

const QUICK_ACTIONS = [
  { href: '/chat',         icon: MessageSquare, label: 'AI Chat',      desc: 'Ask chemistry questions',  color: 'from-blue-500 to-cyan-500' },
  { href: '/visualizer',  icon: Eye,           label: 'Visualizer',   desc: '3D molecule viewer',       color: 'from-purple-500 to-pink-500' },
  { href: '/experiments', icon: FlaskConical,  label: 'Experiments',  desc: 'Run AI experiments',       color: 'from-teal-500 to-emerald-500' },
  { href: '/pharmacology',icon: Pill,          label: 'Drug Library', desc: 'Pharmacology database',    color: 'from-rose-500 to-pink-500' },
  { href: '/lab',         icon: Beaker,        label: 'AI Lab',       desc: 'Advanced tools',           color: 'from-violet-500 to-purple-600' },
  { href: '/research',    icon: BookOpen,      label: 'Research',     desc: 'Save notes',               color: 'from-orange-500 to-yellow-500' },
];

const FEATURED_MOLECULES = [
  { name: 'Aspirin',      formula: 'C₉H₈O₄',     smiles: 'CC(=O)Oc1ccccc1C(=O)O',                          category: 'Analgesic', color: '#3b82f6', desc: 'Pain reliever & anti-inflammatory' },
  { name: 'Caffeine',     formula: 'C₈H₁₀N₄O₂',  smiles: 'Cn1cnc2c1c(=O)n(c(=O)n2C)C',                    category: 'Stimulant', color: '#a855f7', desc: 'Most consumed psychoactive substance' },
  { name: 'Glucose',      formula: 'C₆H₁₂O₆',    smiles: 'OC[C@H]1OC(O)[C@H](O)[C@@H](O)[C@@H]1O',        category: 'Sugar',     color: '#14b8a6', desc: 'Primary cellular energy source' },
  { name: 'Benzene',      formula: 'C₆H₆',        smiles: 'c1ccccc1',                                        category: 'Aromatic',  color: '#f59e0b', desc: 'Prototype aromatic hydrocarbon' },
  { name: 'Paracetamol',  formula: 'C₈H₉NO₂',    smiles: 'CC(=O)Nc1ccc(O)cc1',                             category: 'Analgesic', color: '#ef4444', desc: 'Common OTC pain reliever' },
  { name: 'Ibuprofen',    formula: 'C₁₃H₁₈O₂',   smiles: 'CC(C)Cc1ccc(cc1)C(C)C(=O)O',                    category: 'NSAID',     color: '#8b5cf6', desc: 'Anti-inflammatory drug' },
];

const AI_SUGGESTIONS = [
  { text: 'What is the mechanism of action of Aspirin?',    icon: Pill,         color: '#3b82f6' },
  { text: 'Explain DNA double helix structure',             icon: Dna,          color: '#a855f7' },
  { text: 'How does caffeine block adenosine receptors?',   icon: MessageSquare,color: '#14b8a6' },
  { text: 'What makes benzene aromatic?',                   icon: Atom,         color: '#f59e0b' },
  { text: 'Predict properties of molecule: CCO',            icon: BarChart2,    color: '#ef4444' },
  { text: 'Compare Ibuprofen vs Aspirin mechanisms',        icon: Search,       color: '#8b5cf6' },
];

const EXPERIMENTS_PREVIEW = [
  { title: 'Reaction Predictor', desc: 'Predict chemical reaction products', icon: FlaskConical, color: 'from-blue-500 to-cyan-500',    href: '/experiments' },
  { title: 'Toxicity Predictor', desc: 'Evaluate molecular safety profile',  icon: Shield,       color: 'from-red-500 to-orange-500',   href: '/experiments' },
  { title: 'Similarity Search',  desc: 'Find structurally similar compounds',icon: Search,       color: 'from-purple-500 to-pink-500',  href: '/experiments' },
  { title: 'Drug Analysis',      desc: 'Lipinski Rule of Five checker',       icon: BarChart2,    color: 'from-teal-500 to-emerald-500', href: '/experiments' },
];

const TRENDING = [
  { rank: 1, name: 'GLP-1 Agonists',            desc: 'Diabetes & obesity treatment',  change: '+24%', hot: true },
  { rank: 2, name: 'mRNA Therapeutics',          desc: 'Next-gen drug delivery',        change: '+18%', hot: true },
  { rank: 3, name: 'CRISPR Molecules',           desc: 'Gene editing compounds',        change: '+12%', hot: false },
  { rank: 4, name: 'Antibody-Drug Conjugates',   desc: 'Targeted cancer therapy',       change: '+9%',  hot: false },
  { rank: 5, name: 'Psychedelic Compounds',      desc: 'Mental health research',        change: '+7%',  hot: false },
];

const CHEMISTRY_FACTS = [
  { fact: 'Water is the only substance that exists naturally in all three states on Earth', icon: '💧' },
  { fact: 'Gold is so unreactive that ancient gold coins are still shiny after thousands of years', icon: '⚗️' },
  { fact: 'DNA contains about 3 billion base pairs in every human cell', icon: '🧬' },
  { fact: 'A teaspoon of neutron star material weighs about 10 million tons', icon: '⭐' },
  { fact: 'Oxygen was discovered independently by 3 scientists in the 1770s', icon: '🔬' },
];

export default function DashboardPage() {
  const { user } = useUserStore();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <>
      <Header title="Dashboard" subtitle="Your molecular intelligence hub" />
      <main className="p-6 pt-20 space-y-8 pb-12">

        {/* Welcome Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-teal-500/10 pointer-events-none" />
          <div className="relative z-10 flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{greeting} 👋</p>
              <h2 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--text-primary)' }}>
                Welcome back, <span className="gradient-text">{user?.displayName?.split(' ')[0] || 'Scientist'}</span>
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Ready to explore the molecular world? Your AI chemistry assistant is waiting.</p>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.3)', color: '#2dd4bf' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" /> AI Online
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' }}>
                  <Atom size={10} /> PubChem Connected
                </div>
              </div>
            </div>
            <Link href="/chat">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-neon px-5 py-2.5 text-sm flex items-center gap-2">
                <MessageSquare size={15} /> Start AI Chat
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}20` }}>
                  <stat.icon size={20} style={{ color: stat.color }} />
                </div>
                <div>
                  <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
            <Zap size={14} className="text-yellow-400" /> Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {QUICK_ACTIONS.map((action, i) => (
              <Link key={action.href} href={action.href}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.97 }}
                  className="glass-card p-4 cursor-pointer group text-center"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mx-auto mb-2`}>
                    <action.icon size={18} className="text-white" />
                  </div>
                  <div className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>{action.label}</div>
                  <div className="text-xs mt-0.5 hidden md:block" style={{ color: 'var(--text-muted)' }}>{action.desc}</div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Drug Library Section ── */}
        <div>
          <h3 className="text-sm font-bold mb-3 flex items-center justify-between" style={{ color: 'var(--text-secondary)' }}>
            <span className="flex items-center gap-2"><Pill size={14} className="text-rose-400" /> Drug Library — Important Drugs</span>
            <Link href="/pharmacology">
              <span className="text-xs text-blue-400 hover:underline flex items-center gap-1">View all <ArrowUpRight size={11} /></span>
            </Link>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {DRUGS.slice(0, 5).map((drug, i) => (
              <Link key={drug.id} href="/pharmacology">
                <motion.div
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  className="glass-card p-4 cursor-pointer group"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${drug.color} flex items-center justify-center text-xl mb-2`}>
                    {drug.emoji}
                  </div>
                  <h4 className="text-xs font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{drug.name}</h4>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{drug.category}</p>
                  <p className="text-xs leading-tight" style={{ color: 'var(--text-secondary)' }}>
                    {drug.uses[0]}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ChevronRight size={10} />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Molecules + AI Suggestions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-5">
            <h3 className="text-sm font-bold mb-4 flex items-center justify-between" style={{ color: 'var(--text-primary)' }}>
              <span className="flex items-center gap-2"><Atom size={14} className="text-blue-400" /> Featured Molecules</span>
              <Link href="/visualizer"><span className="text-xs text-blue-400 hover:underline flex items-center gap-1">View all <ArrowUpRight size={11} /></span></Link>
            </h3>
            <div className="space-y-2">
              {FEATURED_MOLECULES.map((mol, i) => (
                <Link key={mol.name} href={`/visualizer?smiles=${encodeURIComponent(mol.smiles)}`}>
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ x: 4 }}
                    className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-white/5 transition-colors group">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: mol.color }}>
                      {mol.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{mol.name}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded-full hidden md:inline" style={{ background: `${mol.color}20`, color: mol.color }}>{mol.category}</span>
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{mol.formula} · {mol.desc}</div>
                    </div>
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 flex-shrink-0" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-bold mb-4 flex items-center justify-between" style={{ color: 'var(--text-primary)' }}>
              <span className="flex items-center gap-2"><MessageSquare size={14} className="text-purple-400" /> Try These Questions</span>
              <Link href="/chat"><span className="text-xs text-blue-400 hover:underline flex items-center gap-1">Open Chat <ArrowUpRight size={11} /></span></Link>
            </h3>
            <div className="space-y-2">
              {AI_SUGGESTIONS.map((s, i) => (
                <Link key={i} href={`/chat?q=${encodeURIComponent(s.text)}`}>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }} whileHover={{ x: 4 }}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl cursor-pointer hover:bg-white/5 transition-colors group">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}20` }}>
                      <s.icon size={13} style={{ color: s.color }} />
                    </div>
                    <span className="text-sm leading-snug" style={{ color: 'var(--text-secondary)' }}>{s.text}</span>
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 flex-shrink-0 mt-1" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Experiments */}
        <div>
          <h3 className="text-sm font-bold mb-3 flex items-center justify-between" style={{ color: 'var(--text-secondary)' }}>
            <span className="flex items-center gap-2"><FlaskConical size={14} className="text-teal-400" /> AI Experiments</span>
            <Link href="/experiments"><span className="text-xs text-blue-400 hover:underline flex items-center gap-1">View all <ArrowUpRight size={11} /></span></Link>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EXPERIMENTS_PREVIEW.map((exp, i) => (
              <Link key={exp.title} href={exp.href}>
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ scale: 1.02, y: -2 }} className="glass-card p-4 cursor-pointer group">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${exp.color} flex items-center justify-center mb-3`}><exp.icon size={18} className="text-white" /></div>
                  <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{exp.title}</h4>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{exp.desc}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">Run now <ChevronRight size={11} /></div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Trending + Facts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-5">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <TrendingUp size={14} className="text-orange-400" /> Trending in Drug Discovery
            </h3>
            <div className="space-y-2">
              {TRENDING.map((item, i) => (
                <motion.div key={item.rank} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: i === 0 ? 'rgba(251,191,36,0.2)' : 'var(--bg-secondary)', color: i === 0 ? '#fbbf24' : 'var(--text-muted)' }}>{item.rank}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                      {item.hot && <Flame size={11} className="text-orange-400" />}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.desc}</div>
                  </div>
                  <span className="text-xs font-semibold text-teal-400">{item.change}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Star size={14} className="text-yellow-400" /> Did You Know?
            </h3>
            <div className="space-y-3">
              {CHEMISTRY_FACTS.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.fact}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-bold mb-4 flex items-center justify-between" style={{ color: 'var(--text-primary)' }}>
            <span className="flex items-center gap-2"><Clock size={14} className="text-blue-400" /> Recent Activity</span>
            <Link href="/history"><span className="text-xs text-blue-400 hover:underline flex items-center gap-1">View history <ArrowUpRight size={11} /></span></Link>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { icon: Atom,         label: 'Viewed Aspirin',        time: '2 hours ago', color: '#3b82f6', href: '/visualizer?smiles=CC(=O)Oc1ccccc1C(=O)O' },
              { icon: MessageSquare,label: 'Asked about Caffeine',   time: '3 hours ago', color: '#a855f7', href: '/chat' },
              { icon: FlaskConical, label: 'Ran Toxicity Test',      time: '5 hours ago', color: '#14b8a6', href: '/experiments' },
            ].map((act, i) => (
              <Link key={i} href={act.href}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} whileHover={{ x: 3 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${act.color}20` }}>
                    <act.icon size={16} style={{ color: act.color }} />
                  </div>
                  <div>
                    <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{act.label}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{act.time}</div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

      </main>
    </>
  );
}
