'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
  delay?: number;
}

export function Card({ children, className, hover = true, glow = false, onClick, delay = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={hover ? { y: -2, scale: 1.01 } : undefined}
      onClick={onClick}
      className={cn(
        'glass-card p-5',
        onClick && 'cursor-pointer',
        glow && 'hover:shadow-neon-blue',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  delay?: number;
}

export function StatCard({ label, value, icon: Icon, color, delay = 0 }: StatCardProps) {
  return (
    <Card delay={delay}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon size={20} style={{ color }} />
        </div>
        <div>
          <div className="text-xl font-bold" style={{ color }}>{value}</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
        </div>
      </div>
    </Card>
  );
}
