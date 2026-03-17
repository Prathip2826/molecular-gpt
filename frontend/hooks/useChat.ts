'use client';
import { useState, useCallback } from 'react';
import type { ChatMessage } from '@/types';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Welcome to **Molecular GPT**! 🧬

I'm your AI chemistry assistant. I can help you with:
- 🔬 Explaining molecular structures
- ⚗️ Predicting chemical reactions  
- 💊 Drug discovery concepts
- 📊 Molecular properties analysis
- 🧪 Experiment design

What would you like to explore today?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // ✅ Next.js API route — CORS fix
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      });
      const data = await res.json();
      let generatedText = data.text || 'No response received. Please try again.';

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
      setError('Failed to get AI response. Please check your API key.');
      setMessages((prev) => prev.filter((m) => m.id !== aiMsgId));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'New conversation started! How can I help you with chemistry today? 🧬',
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  return { messages, isLoading, error, sendMessage, clearMessages };
}