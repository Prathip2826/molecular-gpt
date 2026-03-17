'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useAuth } from '@/hooks/useAuth';
import { useUserStore } from '@/store/userStore';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { sidebarOpen }   = useUserStore();
  const router            = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: 'var(--bg-primary)' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="molecule-loader" />
          <span className="text-sm font-medium gradient-text">Loading Molecular GPT...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>

      {/* Sidebar (handles its own open/close animation) */}
      <Sidebar />

      {/* Main content — shifts right when sidebar is open on desktop */}
      <motion.div
        className="flex-1 flex flex-col min-w-0"
        animate={{
          marginLeft: sidebarOpen ? '260px' : '0px',
        }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        {/* pb-20 on mobile for bottom nav */}
        <div className="flex-1 pt-16 pb-20 md:pb-0">
          {children}
        </div>
      </motion.div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
