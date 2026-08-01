'use client';
import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { History, MessageSquare, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!user) return;
    fetchSessions();
  }, [user]);

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${API_URL}/chat/sessions?user_id=${user?.uid}`);
      const data = await res.json();
      setSessions(data);
    } catch (e) {
      console.error('Failed to fetch history:', e);
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Card click prevent பண்ணு
    try {
      await fetch(`${API_URL}/chat/session/${id}`, { method: 'DELETE' });
      setSessions(prev => prev.filter(s => s.id !== id));
    } catch (e) {
      console.error('Delete failed:', e);
    }
  };

  const openChat = (sessionId: string) => {
    // Chat page-ல் session load பண்ண URL param use பண்ணு
    router.push(`/chat?session=${sessionId}`);
  };

  return (
    <>
      <Header title="History" subtitle={`${sessions.length} chat sessions`} />
      <main className="p-6 pt-20">
        {loading ? (
          <div className="flex justify-center mt-10">
            <Loader2 className="animate-spin" style={{ color: 'var(--text-muted)' }} />
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <History size={48} className="mb-4 opacity-30" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No History Yet</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Start chatting to see your history here.</p>
          </div>
        ) : (
          <div className="space-y-3 max-w-2xl mx-auto">
            {sessions.map(session => (
              <div
                key={session.id}
                onClick={() => openChat(session.id)}
                className="glass-card p-4 flex items-center justify-between cursor-pointer hover:scale-[1.01] transition-transform"
                style={{ border: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <MessageSquare size={16} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {session.title || 'Chat Session'}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {new Date(session.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => deleteSession(session.id, e)}
                  className="p-2 rounded-lg hover:bg-red-500/20 transition-colors flex-shrink-0"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
