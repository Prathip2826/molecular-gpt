'use client';
import { cn } from '@/lib/utils';

// Molecule rotating loader
export function MoleculeLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dims = { sm: 'w-6 h-6', md: 'w-12 h-12', lg: 'w-20 h-20' };
  return (
    <div className={cn('molecule-loader', dims[size])} />
  );
}

// Full page loader
export function PageLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: 'var(--bg-primary)' }}
    >
      <MoleculeLoader size="lg" />
      <p className="mt-4 text-sm font-medium gradient-text">{message}</p>
    </div>
  );
}

// Skeleton shimmer
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('shimmer rounded-xl', className)}
      style={{ background: 'var(--bg-card)', minHeight: '20px' }}
    />
  );
}

// Card skeleton
export function CardSkeleton() {
  return (
    <div className="glass-card p-5 space-y-3">
      <Skeleton className="h-10 w-10 rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

// Chat message skeleton
export function ChatSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

// Dot pulse typing indicator
export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-blue-400"
          style={{
            animation: 'pulse 1.4s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}
