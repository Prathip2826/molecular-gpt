'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, MessageSquare, Hammer, Eye, BookOpen,
  FlaskConical, Beaker, Bookmark, History, User, Settings,
  Atom, LogOut, Moon, Sun, X, Menu, Pill, Grid,
} from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/chat',         icon: MessageSquare,   label: 'Molecular Chat' },
  { href: '/builder',      icon: Hammer,          label: 'Molecule Builder' },
  { href: '/visualizer',   icon: Eye,             label: 'Visualizer' },
  { href: '/experiments',  icon: FlaskConical,    label: 'Experiments' },
  { href: '/pharmacology', icon: Pill,            label: 'Drug Library' },
  { href: '/research',     icon: BookOpen,        label: 'Research Library' },
  { href: '/lab',          icon: Beaker,          label: 'AI Lab' },
  { href: '/periodic-table', icon: Grid, label: 'Periodic Table' },
  { href: '/saved',        icon: Bookmark,        label: 'Saved Molecules' },
  { href: '/history',      icon: History,         label: 'History' },
];

const bottomItems = [
  { href: '/profile',  icon: User,     label: 'Profile' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, theme, toggleTheme, user } = useUserStore();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const handleNavClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/60 z-[98] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed left-0 top-0 h-screen flex flex-col z-[100]"
            style={{
              width: '260px',
              background: 'var(--bg-glass)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRight: '1px solid var(--border)',
            }}
          >
            {/* Logo */}
            <div
              className="flex items-center justify-between px-4 h-16 flex-shrink-0"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <Link href="/dashboard" onClick={handleNavClick}>
                <div className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Atom size={17} className="text-white" />
                  </div>
                  <span className="font-bold text-sm gradient-text whitespace-nowrap">
                    Molecular GPT
                  </span>
                </div>
              </Link>
              <button
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} onClick={handleNavClick}>
                    <motion.div
                      whileHover={{ x: 3 }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer"
                      style={{
                        background: isActive ? 'linear-gradient(135deg, rgba(59,130,246,0.18), rgba(168,85,247,0.18))' : 'transparent',
                        border: isActive ? '1px solid rgba(59,130,246,0.35)' : '1px solid transparent',
                      }}
                    >
                      <item.icon
                        size={18}
                        className="flex-shrink-0 transition-colors"
                        style={{ color: isActive ? '#60a5fa' : 'var(--text-muted)' }}
                      />
                      <span
                        className="text-sm font-medium whitespace-nowrap"
                        style={{ color: isActive ? '#60a5fa' : 'var(--text-secondary)' }}
                      >
                        {item.label}
                      </span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 animate-pulse" />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom */}
            <div
              className="p-3 space-y-0.5 flex-shrink-0"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full hover:bg-white/5 transition-colors"
              >
                {theme === 'dark'
                  ? <Sun size={18} className="text-yellow-400 flex-shrink-0" />
                  : <Moon size={18} className="text-blue-400 flex-shrink-0" />
                }
                <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
              </button>

              {bottomItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} onClick={handleNavClick}>
                    <div
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                      style={{ background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent' }}
                    >
                      <item.icon
                        size={18}
                        className="flex-shrink-0"
                        style={{ color: isActive ? '#60a5fa' : 'var(--text-muted)' }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{ color: isActive ? '#60a5fa' : 'var(--text-secondary)' }}
                      >
                        {item.label}
                      </span>
                    </div>
                  </Link>
                );
              })}

              {user && (
                <div className="pt-2 mt-1" style={{ borderTop: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                      {user.displayName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                        {user.displayName}
                      </div>
                      <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl w-full hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={16} className="text-red-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-red-400">Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Floating open button */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className="fixed top-4 left-4 z-[99] p-2.5 rounded-xl shadow-lg"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            <Menu size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
