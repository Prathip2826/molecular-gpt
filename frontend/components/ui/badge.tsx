'use client';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type BadgeVariant = 'blue' | 'purple' | 'teal' | 'green' | 'red' | 'yellow' | 'gray';

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; border: string; text: string }> = {
  blue:   { bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.35)',  text: '#60a5fa' },
  purple: { bg: 'rgba(168,85,247,0.12)',  border: 'rgba(168,85,247,0.35)',  text: '#c084fc' },
  teal:   { bg: 'rgba(20,184,166,0.12)',  border: 'rgba(20,184,166,0.35)',  text: '#2dd4bf' },
  green:  { bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.35)',   text: '#4ade80' },
  red:    { bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.35)',   text: '#f87171' },
  yellow: { bg: 'rgba(234,179,8,0.12)',   border: 'rgba(234,179,8,0.35)',   text: '#facc15' },
  gray:   { bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.25)', text: '#94a3b8' },
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = 'blue', className }: BadgeProps) {
  const s = VARIANT_STYLES[variant];
  return (
    <span
      className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', className)}
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}
    >
      {children}
    </span>
  );
}

interface TagProps {
  label: string;
  onRemove?: () => void;
}

export function Tag({ label, onRemove }: TagProps) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs"
      style={{
        background: 'rgba(59,130,246,0.1)',
        border: '1px solid rgba(59,130,246,0.3)',
        color: '#60a5fa',
      }}
    >
      {label}
      {onRemove && (
        <button onClick={onRemove} className="ml-0.5 hover:text-red-400 transition-colors leading-none">
          ×
        </button>
      )}
    </span>
  );
}

interface StatusDotProps {
  status: 'online' | 'offline' | 'pending' | 'error';
  label?: string;
}

export function StatusDot({ status, label }: StatusDotProps) {
  const colors = { online: '#22c55e', offline: '#94a3b8', pending: '#f59e0b', error: '#ef4444' };
  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className="w-2 h-2 rounded-full"
        style={{ background: colors[status], boxShadow: status === 'online' ? `0 0 6px ${colors[status]}` : 'none' }}
      />
      {label && <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</span>}
    </div>
  );
}
