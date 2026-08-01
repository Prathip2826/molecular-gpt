'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { useUserStore } from '@/store/userStore';
import { useAuth } from '@/hooks/useAuth';
import { Moon, Sun, User, Bell, Key, Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { theme, toggleTheme, user } = useUserStore();
  const { resetPassword } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [aiTemp, setAiTemp] = useState(0.7);
  const [responseLen, setResponseLen] = useState('medium');

  // Load from localStorage
  useEffect(() => {
    const savedTemp = localStorage.getItem('aiTemp');
    const savedLen = localStorage.getItem('responseLen');
    if (savedTemp) setAiTemp(parseFloat(savedTemp));
    if (savedLen) setResponseLen(savedLen);
  }, []);

  const saveAISettings = () => {
    localStorage.setItem('aiTemp', aiTemp.toString());
    localStorage.setItem('responseLen', responseLen);
    toast.success('AI Settings saved! ✅');
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    try {
      await resetPassword(user.email);
      toast.success('Password reset email sent!');
    } catch {
      toast.error('Failed to send reset email');
    }
  };

  const SECTIONS = [
    {
      title: 'Appearance',
      icon: Sun,
      content: (
        <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Theme</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Currently: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-xl btn-neon text-xs"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            Switch to {theme === 'dark' ? 'Light' : 'Dark'}
          </motion.button>
        </div>
      ),
    },
    {
      title: 'AI Settings',
      icon: Key,
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>
              AI Temperature: {aiTemp.toFixed(1)}
            </label>
            <input
              type="range" min="0" max="1" step="0.1"
              value={aiTemp}
              onChange={(e) => setAiTemp(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              <span>Precise</span><span>Creative</span>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-secondary)' }}>
              Response Length
            </label>
            <div className="flex gap-2">
              {['short', 'medium', 'long'].map((len) => (
                <button
                  key={len}
                  onClick={() => setResponseLen(len)}
                  className={`flex-1 py-2 rounded-xl text-xs capitalize transition-all`}
                  style={{
                    background: responseLen === len ? 'rgba(59,130,246,0.2)' : 'transparent',
                    border: `1px solid ${responseLen === len ? 'rgba(59,130,246,0.4)' : 'var(--border)'}`,
                    color: responseLen === len ? '#60a5fa' : 'var(--text-secondary)',
                  }}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={saveAISettings}
            className="btn-neon w-full py-2 rounded-xl text-xs flex items-center justify-center gap-2"
          >
            <Save size={12} /> Save AI Settings
          </button>
        </div>
      ),
    },
    {
      title: 'Notifications',
      icon: Bell,
      content: (
        <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Push Notifications</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Get updates about experiments</div>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-11 h-6 rounded-full transition-colors relative ${notifications ? 'bg-blue-500' : 'bg-gray-600'}`}
          >
            <span className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${notifications ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
      ),
    },
    {
      title: 'Account',
      icon: User,
      content: (
        <div className="space-y-3">
          <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Logged in as</div>
            <div className="text-sm font-medium mt-1" style={{ color: 'var(--text-primary)' }}>
              {user?.email || 'Not logged in'}
            </div>
          </div>
          <button
            onClick={handleResetPassword}
            className="w-full text-left px-4 py-3 rounded-xl flex items-center justify-between hover:bg-white/5 transition-colors"
            style={{ border: '1px solid var(--border)' }}
          >
            <div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Reset Password</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Send password reset email</div>
            </div>
            <Key size={16} style={{ color: 'var(--text-muted)' }} />
          </button>
          <button
            onClick={() => toast.error('Account deletion requires backend setup')}
            className="w-full text-left px-4 py-3 rounded-xl flex items-center justify-between hover:bg-red-500/10 transition-colors"
            style={{ border: '1px solid rgba(239,68,68,0.3)' }}
          >
            <div>
              <div className="text-sm font-medium text-red-400">Delete Account</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Permanently delete your data</div>
            </div>
            <Trash2 size={16} className="text-red-400" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Header title="Settings" subtitle="Customize your experience" />
      <main className="p-6 pt-20 max-w-2xl space-y-5">
        {SECTIONS.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5"
          >
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <section.icon size={14} className="text-blue-400" /> {section.title}
            </h3>
            {section.content}
          </motion.div>
        ))}
      </main>
    </>
  );
}
