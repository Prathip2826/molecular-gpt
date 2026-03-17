'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, MessageSquare, Eye,
  FlaskConical, Beaker,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { href: '/chat', icon: MessageSquare, label: 'Chat' },
  { href: '/visualizer', icon: Eye, label: 'Viewer' },
  { href: '/experiments', icon: FlaskConical, label: 'Experiments' },
  { href: '/lab', icon: Beaker, label: 'Lab' },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all"
                style={{
                  background: isActive ? 'rgba(59,130,246,0.15)' : 'transparent',
                }}
              >
                <item.icon
                  size={20}
                  style={{ color: isActive ? '#60a5fa' : 'var(--text-muted)' }}
                />
                <span
                  className="text-xs font-medium"
                  style={{ color: isActive ? '#60a5fa' : 'var(--text-muted)' }}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}