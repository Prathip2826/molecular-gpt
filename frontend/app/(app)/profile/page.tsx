'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { useUserStore } from '@/store/userStore';
import { useMoleculeStore } from '@/store/moleculeStore';
import {
  Trophy, Atom, MessageSquare, FlaskConical,
  Star, Award, Zap, Camera, Edit2, Check, X, Loader2,
} from 'lucide-react';
import { getAuth, updateProfile } from 'firebase/auth';
import toast from 'react-hot-toast';

const ACHIEVEMENTS = [
  { icon: Atom,          title: 'Molecule Explorer',  desc: 'Visualized first molecule',  unlocked: true,  color: '#3b82f6' },
  { icon: MessageSquare, title: 'Chemistry Chatter',  desc: 'Sent 10 AI messages',        unlocked: true,  color: '#a855f7' },
  { icon: FlaskConical,  title: 'Lab Rat',             desc: 'Ran first experiment',       unlocked: false, color: '#14b8a6' },
  { icon: Star,          title: 'Molecule Master',     desc: 'Saved 10 molecules',         unlocked: false, color: '#f59e0b' },
  { icon: Award,         title: 'AI Chemist',          desc: 'Used all AI Lab tools',      unlocked: false, color: '#ef4444' },
  { icon: Zap,           title: 'Speed Researcher',    desc: '5 experiments in one day',   unlocked: false, color: '#8b5cf6' },
];

const AVATAR_COLORS = [
  'from-blue-500 to-purple-600',
  'from-teal-500 to-emerald-600',
  'from-orange-500 to-red-500',
  'from-pink-500 to-rose-600',
  'from-violet-500 to-purple-700',
  'from-cyan-500 to-blue-600',
];

export default function ProfilePage() {
  const { user, setUser }   = useUserStore();
  const { molecules }       = useMoleculeStore();

  const [editingName, setEditingName]         = useState(false);
  const [newName, setNewName]                 = useState(user?.displayName || '');
  const [savingName, setSavingName]           = useState(false);
  const [selectedColor, setSelectedColor]     = useState(AVATAR_COLORS[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [photoURL, setPhotoURL]               = useState(user?.photoURL || '');
  const [photoInput, setPhotoInput]           = useState('');

  const stats = [
    { label: 'Molecules Saved', value: molecules.length,                        icon: Atom,          color: '#3b82f6' },
    { label: 'AI Chats',        value: 0,                                        icon: MessageSquare, color: '#a855f7' },
    { label: 'Experiments',     value: 0,                                        icon: FlaskConical,  color: '#14b8a6' },
    { label: 'Achievements',    value: ACHIEVEMENTS.filter(a => a.unlocked).length, icon: Trophy,    color: '#f59e0b' },
  ];

  // Save display name to Firebase
  const saveName = async () => {
    if (!newName.trim()) { toast.error('Name cannot be empty'); return; }
    setSavingName(true);
    try {
      const firebaseUser = getAuth().currentUser;
      if (firebaseUser) {
        await updateProfile(firebaseUser, { displayName: newName.trim() });
        setUser({ ...user!, displayName: newName.trim() });
        toast.success('Name updated! ✅');
        setEditingName(false);
      }
    } catch {
      toast.error('Failed to update name. Try again.');
    } finally {
      setSavingName(false);
    }
  };

  // Save photo URL to Firebase
  const savePhotoURL = async () => {
    if (!photoInput.trim()) { toast.error('Enter a valid image URL'); return; }
    try {
      const firebaseUser = getAuth().currentUser;
      if (firebaseUser) {
        await updateProfile(firebaseUser, { photoURL: photoInput.trim() });
        setPhotoURL(photoInput.trim());
        setUser({ ...user!, photoURL: photoInput.trim() });
        toast.success('Profile photo updated! 📸');
        setShowColorPicker(false);
        setPhotoInput('');
      }
    } catch {
      toast.error('Failed to update photo. Try again.');
    }
  };

  // Remove photo
  const removePhoto = async () => {
    try {
      const firebaseUser = getAuth().currentUser;
      if (firebaseUser) {
        await updateProfile(firebaseUser, { photoURL: '' });
        setPhotoURL('');
        setUser({ ...user!, photoURL: undefined });
        toast.success('Photo removed');
      }
    } catch {
      toast.error('Failed to remove photo');
    }
  };

  return (
    <>
      <Header title="Profile" subtitle="Your researcher profile" />
      <main className="p-6 pt-20 max-w-3xl space-y-6">

        {/* ── Profile Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-start gap-5 flex-wrap">

            {/* Avatar */}
            <div className="relative group flex-shrink-0">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt="Profile"
                  className="w-20 h-20 rounded-2xl object-cover"
                  onError={() => setPhotoURL('')}
                />
              ) : (
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${selectedColor} flex items-center justify-center text-white text-3xl font-bold select-none`}>
                  {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <button
                onClick={() => setShowColorPicker(p => !p)}
                className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                title="Change avatar"
              >
                <Camera size={20} className="text-white" />
              </button>
            </div>

            {/* Color/Photo Picker Popup */}
            <AnimatePresence>
              {showColorPicker && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  className="absolute z-50 mt-24 p-4 rounded-2xl"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                    minWidth: '230px',
                  }}
                >
                  <button
                    onClick={() => setShowColorPicker(false)}
                    className="absolute top-2 right-2 p-1 rounded-lg hover:bg-white/10"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <X size={13} />
                  </button>

                  <p className="text-xs font-semibold mb-2.5" style={{ color: 'var(--text-secondary)' }}>
                    Avatar Color
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {AVATAR_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => { setSelectedColor(color); setPhotoURL(''); }}
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} transition-all ${
                          selectedColor === color && !photoURL ? 'ring-2 ring-white scale-110' : 'hover:scale-105'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="my-3" style={{ borderTop: '1px solid var(--border)' }} />

                  <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Profile Photo (paste URL)
                  </p>
                  <input
                    value={photoInput}
                    onChange={e => setPhotoInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && savePhotoURL()}
                    placeholder="https://example.com/photo.jpg"
                    className="input-neon w-full px-3 py-2 rounded-xl text-xs mb-2"
                  />
                  <div className="flex gap-2">
                    <button onClick={savePhotoURL} className="btn-neon flex-1 py-2 text-xs flex items-center justify-center gap-1">
                      <Check size={11} /> Set Photo
                    </button>
                    {photoURL && (
                      <button
                        onClick={removePhoto}
                        className="px-3 py-2 rounded-xl text-xs transition-colors"
                        style={{ border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* User Info */}
            <div className="flex-1 min-w-0">

              {/* Editable Name */}
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {editingName ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') saveName();
                        if (e.key === 'Escape') { setEditingName(false); setNewName(user?.displayName || ''); }
                      }}
                      className="input-neon px-3 py-1.5 rounded-xl text-base font-bold flex-1"
                      autoFocus
                      maxLength={40}
                    />
                    <button
                      onClick={saveName}
                      disabled={savingName}
                      className="p-1.5 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(59,130,246,0.2)', color: '#60a5fa' }}
                    >
                      {savingName ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    </button>
                    <button
                      onClick={() => { setEditingName(false); setNewName(user?.displayName || ''); }}
                      className="p-1.5 rounded-lg hover:bg-white/10"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {user?.displayName || 'Scientist'}
                    </h2>
                    <button
                      onClick={() => { setEditingName(true); setNewName(user?.displayName || ''); }}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                      title="Edit name"
                    >
                      <Edit2 size={13} />
                    </button>
                  </>
                )}
              </div>

              <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>

              {!editingName && (
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)', opacity: 0.55 }}>
                  ✏️ Click pencil to edit name · 📷 Hover avatar to change photo/color
                </p>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' }}>
                  🔬 Researcher
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.3)', color: '#2dd4bf' }}>
                  ✓ Verified
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)', color: '#c084fc' }}>
                  🧬 AI User
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-4 text-center"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                style={{ background: `${stat.color}20` }}>
                <stat.icon size={18} style={{ color: stat.color }} />
              </div>
              <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* ── Achievements ── */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Trophy size={14} className="text-yellow-400" /> Achievements
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {ACHIEVEMENTS.map((ach, i) => (
              <motion.div
                key={ach.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.06 }}
                className={`p-3 rounded-xl flex items-start gap-3 ${!ach.unlocked ? 'opacity-40 grayscale' : ''}`}
                style={{
                  background: ach.unlocked ? `${ach.color}12` : 'var(--bg-secondary)',
                  border: `1px solid ${ach.unlocked ? ach.color + '35' : 'var(--border)'}`,
                }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${ach.color}22` }}>
                  <ach.icon size={16} style={{ color: ach.color }} />
                </div>
                <div>
                  <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{ach.title}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{ach.desc}</div>
                  {ach.unlocked && (
                    <div className="text-xs text-teal-400 mt-0.5 flex items-center gap-1">
                      <Check size={10} /> Unlocked
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </main>
    </>
  );
}
