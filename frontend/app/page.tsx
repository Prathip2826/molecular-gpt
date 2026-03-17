'use client';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import {
  Atom, Zap, FlaskConical, Brain, ChevronRight,
  Star, Microscope, Pill, Dna, Shield, BarChart2,
  BookOpen, Users, Globe, ArrowRight,
} from 'lucide-react';

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, -80]);

  // Particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const colors = ['#3b82f6', '#a855f7', '#14b8a6', '#06b6d4'];
    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      radius: number; color: string; alpha: number;
    }> = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2.5 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.5 + 0.2,
    }));

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59,130,246,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  const FEATURES = [
    { icon: Atom,       title: '3D Molecule Viewer',      desc: 'Interactive SMILES/PDB visualization with ball-stick, space-fill & wireframe modes',   color: 'from-blue-500 to-cyan-500' },
    { icon: Brain,      title: 'AI Chemistry Chat',        desc: 'Groq-powered fast AI assistant for questions, reactions & drug analysis',               color: 'from-purple-500 to-pink-500' },
    { icon: FlaskConical,title: 'Experiment Engine',       desc: 'Reaction prediction, toxicity analysis, molecular similarity search & more',            color: 'from-teal-500 to-emerald-500' },
    { icon: Zap,        title: 'Molecule Builder',         desc: 'Drag-and-drop atom editor with real-time 3D preview and SMILES export',                 color: 'from-orange-500 to-yellow-500' },
    { icon: Pill,       title: 'Drug Discovery Tools',     desc: 'Lipinski Rule of Five checker, drug candidate finder, and bioavailability analysis',    color: 'from-rose-500 to-pink-500' },
    { icon: Microscope, title: 'Research Library',         desc: 'Save molecules, notes, and research findings in your personal science notebook',        color: 'from-violet-500 to-purple-600' },
  ];

  const STATS = [
    { value: '118M+', label: 'Molecules in PubChem',  icon: Atom },
    { value: '100%',  label: 'Free to use',           icon: Star },
    { value: '⚡ Fast',label: 'Groq AI (sub-second)', icon: Zap },
    { value: '∞',     label: 'Research possibilities',icon: Globe },
  ];

  const USE_CASES = [
    { icon: Users,    title: 'Students',    desc: 'Learn chemistry visually with 3D molecules and AI explanations', color: '#3b82f6' },
    { icon: Microscope,title: 'Researchers', desc: 'Analyze drug candidates, predict reactions, explore structures',  color: '#a855f7' },
    { icon: Dna,      title: 'Educators',   desc: 'Create interactive chemistry demonstrations and teaching tools',   color: '#14b8a6' },
    { icon: Shield,   title: 'Industry',    desc: 'Rapid screening of drug-like molecules and safety profiling',      color: '#f59e0b' },
  ];

  const HOW_IT_WORKS = [
    { step: '01', title: 'Sign Up Free',        desc: 'Create your account in seconds. No credit card needed.',             icon: Star },
    { step: '02', title: 'Search or Build',     desc: 'Search 118M+ molecules from PubChem or build your own with SMILES.', icon: Atom },
    { step: '03', title: 'Visualize in 3D',     desc: 'See molecules come alive in interactive 3D — rotate, zoom, spin.',    icon: Microscope },
    { step: '04', title: 'Chat with AI',        desc: 'Ask chemistry questions and get expert-level answers instantly.',     icon: Brain },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4"
        style={{ background: 'rgba(2,8,23,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Logo — click goes to home (/) */}
        <Link href="/">
          <motion.div whileHover={{ scale: 1.03 }} className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Atom size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">Molecular GPT</span>
          </motion.div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {['Features', 'How it works', 'Use cases'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="text-sm hover:text-blue-400 transition-colors"
              style={{ color: 'var(--text-secondary)' }}>
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <button className="px-4 py-2 text-sm font-medium transition-colors hover:text-blue-400"
              style={{ color: 'var(--text-secondary)' }}>
              Sign In
            </button>
          </Link>
          <Link href="/signup">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="btn-neon text-sm px-5 py-2">
              Get Started Free
            </motion.button>
          </Link>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ y: heroY }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8"
            style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.35)', color: '#60a5fa' }}
          >
            <Zap size={12} className="animate-pulse" />
            Powered by Groq AI · 118M+ Molecules · 100% Free
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight" style={{ color: 'var(--text-primary)' }}>
            Explore Chemistry<br />
            <span className="gradient-text">with AI Intelligence</span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10" style={{ color: 'var(--text-secondary)' }}>
            Visualize molecules in 3D, chat with an AI chemistry expert, simulate reactions,
            and accelerate your research — all in one free platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-neon flex items-center gap-2 px-8 py-3.5 text-base"
              >
                Start Exploring Free <ChevronRight size={18} />
              </motion.button>
            </Link>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-card px-8 py-3.5 text-base font-semibold flex items-center gap-2"
                style={{ color: 'var(--text-primary)' }}
              >
                Sign In <ArrowRight size={16} />
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-3xl w-full"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="glass-card p-4 text-center"
            >
              <div className="text-2xl font-extrabold gradient-text">{stat.value}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--text-primary)' }}>
            Everything you need to do <span className="gradient-text">great chemistry</span>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            A complete molecular intelligence platform — from visualization to AI-powered drug discovery.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.02, y: -3 }}
              className="glass-card p-6"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4`}>
                <f.icon size={24} className="text-white" />
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="relative z-10 py-20 px-6"
        style={{ background: 'rgba(59,130,246,0.04)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--text-primary)' }}>
              Get started in <span className="gradient-text">4 simple steps</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5 text-center relative"
              >
                <div className="text-4xl font-extrabold mb-3 gradient-text opacity-30">{step.step}</div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
                  <step.icon size={20} className="text-white" />
                </div>
                <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                    <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Use Cases ── */}
      <section id="use-cases" className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: 'var(--text-primary)' }}>
            Built for <span className="gradient-text">everyone in science</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {USE_CASES.map((uc, i) => (
            <motion.div
              key={uc.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${uc.color}20` }}>
                <uc.icon size={22} style={{ color: uc.color }} />
              </div>
              <div>
                <h3 className="font-bold text-base mb-1" style={{ color: 'var(--text-primary)' }}>{uc.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{uc.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Molecules Showcase ── */}
      <section className="relative z-10 py-20 px-6"
        style={{ background: 'rgba(168,85,247,0.04)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-extrabold mb-3" style={{ color: 'var(--text-primary)' }}>
              Explore famous <span className="gradient-text">molecules</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Aspirin',     formula: 'C₉H₈O₄',    color: '#3b82f6', smiles: 'CC(=O)Oc1ccccc1C(=O)O' },
              { name: 'Caffeine',    formula: 'C₈H₁₀N₄O₂', color: '#a855f7', smiles: 'Cn1cnc2c1c(=O)n(c(=O)n2C)C' },
              { name: 'Glucose',     formula: 'C₆H₁₂O₆',   color: '#14b8a6', smiles: 'OCC1OC(O)C(O)C(O)C1O' },
              { name: 'Benzene',     formula: 'C₆H₆',       color: '#f59e0b', smiles: 'c1ccccc1' },
              { name: 'Paracetamol', formula: 'C₈H₉NO₂',   color: '#ef4444', smiles: 'CC(=O)Nc1ccc(O)cc1' },
              { name: 'Ibuprofen',   formula: 'C₁₃H₁₈O₂',  color: '#8b5cf6', smiles: 'CC(C)Cc1ccc(cc1)C(C)C(=O)O' },
              { name: 'Ethanol',     formula: 'C₂H₅OH',     color: '#06b6d4', smiles: 'CCO' },
              { name: 'DNA Base',    formula: 'Adenine',     color: '#ec4899', smiles: 'Nc1ncnc2[nH]cnc12' },
            ].map((mol, i) => (
              <Link key={mol.name} href={`/visualizer?smiles=${encodeURIComponent(mol.smiles)}`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  className="glass-card p-4 text-center cursor-pointer"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm mx-auto mb-2"
                    style={{ background: mol.color }}
                  >
                    {mol.name.charAt(0)}
                  </div>
                  <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{mol.name}</div>
                  <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{mol.formula}</div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 text-center py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card max-w-2xl mx-auto p-12"
          style={{ boxShadow: '0 0 80px rgba(59,130,246,0.15)' }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
            <Atom size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-extrabold mb-4" style={{ color: 'var(--text-primary)' }}>
            Ready to explore the <span className="gradient-text">molecular world?</span>
          </h2>
          <p className="mb-8 text-base" style={{ color: 'var(--text-secondary)' }}>
            Join thousands of students and researchers using Molecular GPT. Free forever. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-neon px-10 py-3.5 text-base flex items-center gap-2"
              >
                Create Free Account <ChevronRight size={18} />
              </motion.button>
            </Link>
            <Link href="/login">
              <button className="px-6 py-3.5 text-sm font-medium hover:text-blue-400 transition-colors"
                style={{ color: 'var(--text-secondary)' }}>
                Already have an account? Sign in →
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 text-center py-8 px-6"
        style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Atom size={13} className="text-white" />
          </div>
          <span className="font-bold text-sm gradient-text">Molecular GPT</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Built with Next.js · Groq AI · PubChem · 3Dmol.js · Firebase
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
          Free for students and researchers worldwide 🧬
        </p>
      </footer>
    </div>
  );
}
