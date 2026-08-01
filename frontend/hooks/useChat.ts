'use client';
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { ChatMessage } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
}

export function useChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Welcome to **Molecular GPT**! 🧬\n\nI'm your AI chemistry assistant. I can help you with:\n- 🔬 Explaining molecular structures\n- ⚗️ Predicting chemical reactions\n- 💊 Drug discovery concepts\n- 📊 Molecular properties analysis\n- 🧪 Experiment design\n\nWhat would you like to explore today?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  // ── Load past sessions ──────────────────────────────────
  const loadSessions = useCallback(async () => {
    if (!user) return;
    setSessionsLoading(true);
    try {
      const res = await fetch(`${API_URL}/chat/sessions?user_id=${user.uid}`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (e) {
      console.error('Failed to load sessions:', e);
    } finally {
      setSessionsLoading(false);
    }
  }, [user]);

  // Load sessions when user logs in
  useEffect(() => {
    if (user) loadSessions();
  }, [user, loadSessions]);

  // ── Load messages for a session ─────────────────────────
  const loadSession = useCallback(async (sid: string) => {
    try {
      const res = await fetch(`${API_URL}/chat/${sid}/messages`);
      if (res.ok) {
        const data = await res.json();
        const loaded: ChatMessage[] = data.map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: m.timestamp,
          isStreaming: false,
        }));
        setMessages(loaded.length > 0 ? loaded : [{
          id: '1',
          role: 'assistant',
          content: 'Continue your chemistry exploration! 🧬',
          timestamp: new Date().toISOString(),
        }]);
        setSessionId(sid);
      }
    } catch (e) {
      console.error('Failed to load session:', e);
    }
  }, []);

  // ── Create new session ──────────────────────────────────
  const getOrCreateSession = useCallback(async () => {
    if (sessionId) return sessionId;
    if (!user) return null;
    try {
      const res = await fetch(`${API_URL}/chat/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.uid }),
      });
      const data = await res.json();
      setSessionId(data.id);
      // Refresh sessions list
      loadSessions();
      return data.id;
    } catch {
      return null;
    }
  }, [sessionId, user, loadSessions]);

  // ── Send message ────────────────────────────────────────
 const sendMessage = useCallback(async (content: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    const aiMsgId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, {
      id: aiMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true,
    }]);

    // ✅ Get AI settings from localStorage
    const aiTemp = parseFloat(localStorage.getItem('aiTemp') || '0.7');
    const responseLen = localStorage.getItem('responseLen') || 'medium';
    const maxTokens = responseLen === 'short' ? 512 : responseLen === 'long' ? 2048 : 1024;

    try {
      const sid = await getOrCreateSession();
      const endpoint = sid
        ? `${API_URL}/chat/${sid}/message`
        : `${API_URL}/chat/simple`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: content,
          temperature: aiTemp,
          max_tokens: maxTokens,
        }),
      });
      const data = await res.json();
      const generatedText = data.response || data.text || 'No response received.';

      // Simulate streaming
      let displayed = '';
      for (let i = 0; i < generatedText.length; i++) {
        displayed += generatedText[i];
        const snap = displayed;
        setMessages((prev) =>
          prev.map((m) => m.id === aiMsgId
            ? { ...m, content: snap, isStreaming: i < generatedText.length - 1 }
            : m
          )
        );
        if (i % 3 === 0) await new Promise((r) => setTimeout(r, 15));
      }
      setMessages((prev) =>
        prev.map((m) => (m.id === aiMsgId ? { ...m, isStreaming: false } : m))
      );
    } catch {
      setError('Failed to get AI response.');
      setMessages((prev) => prev.filter((m) => m.id !== aiMsgId));
    } finally {
      setIsLoading(false);
    }
  }, [getOrCreateSession]);

  // ── Clear / New chat ────────────────────────────────────
  const clearMessages = useCallback(() => {
    setSessionId(null);
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'New conversation started! How can I help you with chemistry today? 🧬',
      timestamp: new Date().toISOString(),
    }]);
  }, []);

  // ── Delete session ──────────────────────────────────────
  const deleteSession = useCallback(async (sid: string) => {
    try {
      await fetch(`${API_URL}/chat/session/${sid}`, { method: 'DELETE' });
      setSessions((prev) => prev.filter((s) => s.id !== sid));
      if (sessionId === sid) clearMessages();
    } catch (e) {
      console.error('Delete failed:', e);
    }
  }, [sessionId, clearMessages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    sessions,
    sessionsLoading,
    loadSession,
    deleteSession,
    currentSessionId: sessionId,
  };
}
