'use client';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useUserStore } from '@/store/userStore';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useUserStore();
  const isDark = theme === 'dark';

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`relative w-14 h-7 rounded-full transition-colors flex items-center ${className || ''}`}
      style={{
        background: isDark ? 'rgba(59,130,246,0.3)' : 'rgba(234,179,8,0.3)',
        border: `1px solid ${isDark ? 'rgba(59,130,246,0.5)' : 'rgba(234,179,8,0.5)'}`,
      }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Track icons */}
      <Sun size={11} className="absolute left-1.5 text-yellow-400" />
      <Moon size={11} className="absolute right-1.5 text-blue-400" />

      {/* Thumb */}
      <motion.div
        animate={{ x: isDark ? 28 : 4 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="w-5 h-5 rounded-full absolute flex items-center justify-center"
        style={{
          background: isDark ? '#3b82f6' : '#f59e0b',
          boxShadow: isDark ? '0 0 8px rgba(59,130,246,0.6)' : '0 0 8px rgba(245,158,11,0.6)',
        }}
      >
        {isDark
          ? <Moon size={10} className="text-white" />
          : <Sun size={10} className="text-white" />
        }
      </motion.div>
    </motion.button>
  );
}
