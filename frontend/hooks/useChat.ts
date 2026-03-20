'use client';
import { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { ChatMessage } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
      return data.id;
    } catch {
      return null;
    }
  }, [sessionId, user]);

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
    const aiMsg: ChatMessage = {
      id: aiMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true,
    };
    setMessages((prev) => [...prev, aiMsg]);

    try {
      const sid = await getOrCreateSession();
      const endpoint = sid
        ? `${API_URL}/chat/${sid}/message`
        : `${API_URL}/chat/simple`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      });
      const data = await res.json();
      let generatedText = data.response || data.text || 'No response received.';

      // Simulate streaming
      let displayed = '';
      for (let i = 0; i < generatedText.length; i++) {
        displayed += generatedText[i];
        const snap = displayed;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId
              ? { ...m, content: snap, isStreaming: i < generatedText.length - 1 }
              : m
          )
        );
        if (i % 3 === 0) await new Promise((r) => setTimeout(r, 15));
      }
      setMessages((prev) =>
        prev.map((m) => (m.id === aiMsgId ? { ...m, isStreaming: false } : m))
      );
    } catch (err) {
      setError('Failed to get AI response.');
      setMessages((prev) => prev.filter((m) => m.id !== aiMsgId));
    } finally {
      setIsLoading(false);
    }
  }, [getOrCreateSession]);

  const clearMessages = useCallback(() => {
    setSessionId(null);
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'New conversation started! How can I help you with chemistry today? 🧬',
      timestamp: new Date().toISOString(),
    }]);
  }, []);

  return { messages, isLoading, error, sendMessage, clearMessages };
}