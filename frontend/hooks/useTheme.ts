'use client';
import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';

export function useTheme() {
  const { theme, setTheme, toggleTheme } = useUserStore();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [theme]);

  return { theme, setTheme, toggleTheme, isDark: theme === 'dark' };
}
