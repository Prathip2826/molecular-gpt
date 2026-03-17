'use client';
import { Header } from '@/components/layout/header';
import { History } from 'lucide-react';

export default function HistoryPage() {
  return (
    <>
      <Header title="History" subtitle="Your activity log" />
      <main className="p-6 pt-20 flex flex-col items-center justify-center min-h-[60vh]">
        <History size={48} className="mb-4 opacity-30" style={{ color: 'var(--text-muted)' }} />
        <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Activity History</h3>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Your chat and experiment history will appear here.</p>
      </main>
    </>
  );
}
