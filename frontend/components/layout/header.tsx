'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Menu, X, Check, User, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const NOTIFICATIONS = [
  { id: '1', title: 'AI Model Ready',        desc: 'Groq AI is online and ready',      time: 'Just now',  read: false, color: '#14b8a6' },
  { id: '2', title: 'Molecule Visualizer',   desc: '3D viewer loaded successfully',    time: '2 min ago', read: false, color: '#3b82f6' },
  { id: '3', title: 'Welcome to Molecular GPT!', desc: 'Start exploring molecules',   time: '5 min ago', read: true,  color: '#a855f7' },
];

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const [searchQuery, setSearchQuery]   = useState('');
  const [showNotif, setShowNotif]       = useState(false);
  const [showProfile, setShowProfile]   = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const { user, toggleSidebar, sidebarOpen } = useUserStore();
  const { signOut } = useAuth();
  const router = useRouter();

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead    = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const handleSignOut = async () => {
    setShowProfile(false);
    await signOut();
    router.push('/login');
  };

  const PROFILE_MENU = [
    { icon: User,     label: 'View Profile',     desc: 'Achievements & stats',     onClick: () => { router.push('/profile');  setShowProfile(false); }, color: '#3b82f6', danger: false },
    { icon: Settings, label: 'Account Settings', desc: 'Theme, AI, preferences',   onClick: () => { router.push('/settings'); setShowProfile(false); }, color: '#a855f7', danger: false },
    { icon: LogOut,   label: 'Sign Out',          desc: 'Logout from account',      onClick: handleSignOut,                                             color: '#ef4444', danger: true  },
  ];

  // Get avatar — photo or initials
  const avatarLetter = user?.displayName?.charAt(0).toUpperCase() || 'U';
  const hasPhoto     = !!(user as any)?.photoURL;

  return (
    <header
      className="fixed top-0 right-0 z-[90] flex items-center justify-between px-4 md:px-6 h-16"
      style={{
        left: 0,
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* ── Left: Menu + Title ── */}
      <div className="flex items-center gap-3">
        {/* Menu button — always visible */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSidebar}
          className="p-2 rounded-xl transition-colors flex-shrink-0"
          style={{
            background: sidebarOpen ? 'rgba(59,130,246,0.15)' : 'var(--bg-card)',
            border: `1px solid ${sidebarOpen ? 'rgba(59,130,246,0.35)' : 'var(--border)'}`,
            color: sidebarOpen ? '#60a5fa' : 'var(--text-secondary)',
          }}
          title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <Menu size={17} />
        </motion.button>

        <div className="hidden sm:block">
          <h1 className="text-sm font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs leading-tight" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
          )}
        </div>
      </div>

      {/* ── Center: Search ── */}
      <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl w-64 input-neon">
        <Search size={14} style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search molecules..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="bg-transparent text-sm w-full outline-none"
          style={{ color: 'var(--text-primary)' }}
        />
      </div>

      {/* ── Right: Bell + Profile ── */}
      <div className="flex items-center gap-2">

        {/* ── Bell ── */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setShowNotif(p => !p); setShowProfile(false); }}
            className="p-2 rounded-xl relative"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <Bell size={17} style={{ color: 'var(--text-secondary)' }} />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white font-bold"
                style={{ background: '#3b82f6', fontSize: '9px' }}
              >
                {unreadCount}
              </span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotif && (
              <>
                <div className="fixed inset-0 z-[91]" onClick={() => setShowNotif(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-80 z-[92] rounded-2xl overflow-hidden"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}
                >
                  <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-xs"
                          style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa' }}>
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-xs flex items-center gap-1 hover:text-blue-400 transition-colors"
                          style={{ color: 'var(--text-muted)' }}>
                          <Check size={10} /> All read
                        </button>
                      )}
                      <button onClick={() => setShowNotif(false)}>
                        <X size={13} style={{ color: 'var(--text-muted)' }} />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map(notif => (
                      <motion.div
                        key={notif.id}
                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                        onClick={() => markRead(notif.id)}
                        className="flex items-start gap-3 px-4 py-3 cursor-pointer"
                        style={{ borderBottom: '1px solid var(--border)', opacity: notif.read ? 0.55 : 1 }}
                      >
                        <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                          style={{ background: notif.read ? 'var(--text-muted)' : notif.color, boxShadow: notif.read ? 'none' : `0 0 6px ${notif.color}` }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{notif.title}</div>
                          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{notif.desc}</div>
                          <div className="text-xs mt-0.5 opacity-60" style={{ color: 'var(--text-muted)' }}>{notif.time}</div>
                        </div>
                        {!notif.read && (
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: '#3b82f6' }} />
                        )}
                      </motion.div>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 text-center">
                    <button className="text-xs text-blue-400 hover:underline" onClick={() => setShowNotif(false)}>
                      View all
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* ── Profile Avatar + Dropdown ── */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setShowProfile(p => !p); setShowNotif(false); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all"
            style={{
              background: showProfile ? 'var(--bg-card)' : 'transparent',
              border: showProfile ? '1px solid var(--border)' : '1px solid transparent',
            }}
          >
            {/* Avatar — shows photo if available, else gradient initial */}
            {hasPhoto ? (
              <img
                src={(user as any)?.photoURL}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {avatarLetter}
              </div>
            )}
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
                {user?.displayName || 'Scientist'}
              </div>
              <div className="text-xs leading-tight" style={{ color: 'var(--text-muted)' }}>Researcher</div>
            </div>
            <ChevronRight
              size={13}
              className="hidden md:block transition-transform"
              style={{ color: 'var(--text-muted)', transform: showProfile ? 'rotate(90deg)' : 'rotate(0deg)' }}
            />
          </motion.button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {showProfile && (
              <>
                <div className="fixed inset-0 z-[91]" onClick={() => setShowProfile(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-64 z-[92] rounded-2xl overflow-hidden"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}
                >
                  {/* User info */}
                  <div className="px-4 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-3">
                      {hasPhoto ? (
                        <img src={(user as any)?.photoURL} alt="Profile"
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {avatarLetter}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                          {user?.displayName || 'Scientist'}
                        </div>
                        <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                          {user?.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                      <span className="text-xs text-teal-400">Online · AI Ready</span>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="p-2">
                    {PROFILE_MENU.map(item => (
                      <motion.button
                        key={item.label}
                        whileHover={{ x: 3 }}
                        onClick={item.onClick}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left"
                        onMouseEnter={e => { e.currentTarget.style.background = item.danger ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.05)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                        style={{ background: 'transparent' }}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: `${item.color}20` }}>
                          <item.icon size={14} style={{ color: item.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold" style={{ color: item.danger ? '#ef4444' : 'var(--text-primary)' }}>
                            {item.label}
                          </div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.desc}</div>
                        </div>
                        <ChevronRight size={11} style={{ color: 'var(--text-muted)' }} />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
