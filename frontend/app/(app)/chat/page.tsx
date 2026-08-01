'use client';
import { useEffect, useRef, useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { useChat } from '@/hooks/useChat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Plus, Copy, Bot, User, Loader2, X, ChevronRight, History } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMolecule } from '@/hooks/useMolecule';

function ChatContent() {
  const searchParams = useSearchParams();
  const {
    messages, isLoading, sendMessage, clearMessages,
    sessions, sessionsLoading, loadSession, deleteSession, currentSessionId
  } = useChat();
  const [input, setInput] = useState('');
  const [showRecents, setShowRecents] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { commonMolecules, loadFromSMILES } = useMolecule();

  // URL-ல் session param இருந்தா load பண்ணு
useEffect(() => {
  const sessionParam = searchParams.get('session');
  if (sessionParam) {
    loadSession(sessionParam);
  }
}, [searchParams]);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setInput(q);
      setTimeout(() => { sendMessage(q); setInput(''); }, 500);
    }
  }, [searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const msg = input.trim();
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    await sendMessage(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied!');
  };

  const QUICK_PROMPTS = [
    'What is aspirin and how does it work?',
    'Explain molecular orbital theory',
    'How does enzyme catalysis work?',
    'Difference between ionic and covalent bonds',
    'What is the SMILES for caffeine?',
  ];

  return (
    <>
      <Header title="Molecular Chat" subtitle="AI Chemistry Assistant" />
      <div className="flex h-[calc(100vh-4rem)] pt-16 relative">

        {/* ── Left Sidebar (Desktop only) ── */}
        <div
          className="w-52 flex-shrink-0 p-3 space-y-2 overflow-y-auto hidden lg:flex flex-col"
          style={{ borderRight: '1px solid var(--border)' }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={clearMessages}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl btn-neon text-xs"
          >
            <Plus size={13} /> New Chat
          </motion.button>

          {/* Past Sessions from DB */}
          <div className="pt-1">
            <p className="text-xs mb-2 px-1 font-medium" style={{ color: 'var(--text-muted)' }}>
              Recent Chats
            </p>
            {sessionsLoading ? (
              <div className="flex justify-center py-2">
                <Loader2 size={14} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
              </div>
            ) : sessions.length === 0 ? (
              <p className="text-xs px-1" style={{ color: 'var(--text-muted)' }}>No history yet</p>
            ) : (
              sessions.slice(0, 8).map((s) => (
                <div key={s.id} className="flex items-center gap-1 mb-1 group">
                  <button
                    onClick={() => loadSession(s.id)}
                    className={`flex-1 text-left text-xs px-3 py-2 rounded-xl transition-colors truncate ${
                      currentSessionId === s.id ? 'bg-blue-500/20' : 'hover:bg-white/5'
                    }`}
                    style={{ color: currentSessionId === s.id ? '#60a5fa' : 'var(--text-secondary)' }}
                  >
                    {s.title || 'Chat Session'}
                  </button>
                  <button
                    onClick={() => deleteSession(s.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 transition-all flex-shrink-0"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <X size={11} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="pt-1">
            <p className="text-xs mb-2 px-1 font-medium" style={{ color: 'var(--text-muted)' }}>
              Quick Topics
            </p>
            {QUICK_PROMPTS.map((p, i) => (
              <button
                key={i}
                onClick={() => setInput(p)}
                className="w-full text-left text-xs px-3 py-2 rounded-xl hover:bg-white/5 transition-colors mb-1 leading-snug"
                style={{ color: 'var(--text-secondary)' }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* ── Center: Chat Messages ── */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                      : 'bg-gradient-to-br from-teal-500 to-emerald-600'
                  }`}>
                    {msg.role === 'user'
                      ? <User size={14} className="text-white" />
                      : <Bot size={14} className="text-white" />
                    }
                  </div>

                  <div className={`max-w-[75%] group relative ${
                    msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none text-sm" style={{ color: 'var(--text-primary)' }}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                        {msg.isStreaming && (
                          <span className="inline-block w-1.5 h-4 bg-blue-400 animate-pulse ml-0.5 align-middle rounded-sm" />
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-white leading-relaxed">{msg.content}</p>
                    )}
                    <div className={`flex items-center gap-2 mt-1.5 ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                      <span className="text-xs opacity-50" style={{ color: msg.role === 'user' ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)' }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {!msg.isStreaming && msg.role === 'assistant' && (
                        <button onClick={() => copyMessage(msg.content)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded" style={{ color: 'var(--text-muted)' }}>
                          <Copy size={10} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="chat-bubble-ai flex items-center gap-2">
                  <Loader2 size={13} className="animate-spin text-blue-400" />
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Thinking...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 md:p-4" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="flex gap-2 items-end rounded-2xl p-2" style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)' }}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about chemistry... (Enter to send)"
                rows={1}
                className="flex-1 bg-transparent text-sm resize-none outline-none px-2 py-1.5"
                style={{ color: 'var(--text-primary)', minHeight: '36px', maxHeight: '120px', fontFamily: 'Plus Jakarta Sans, sans-serif', lineHeight: '1.5' }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="btn-neon p-2.5 rounded-xl disabled:opacity-40 flex-shrink-0"
                style={{ minWidth: '40px', minHeight: '40px' }}
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </motion.button>
            </div>
            <p className="text-xs mt-1.5 text-center" style={{ color: 'var(--text-muted)' }}>
              ↵ Enter to send · Shift+Enter for new line · Groq AI
            </p>
          </div>
        </div>

        {/* ── Right Panel (Desktop only) ── */}
        <AnimatePresence>
          {showRecents && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '180px', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex-shrink-0 overflow-hidden hidden md:flex flex-col"
              style={{ borderLeft: '1px solid var(--border)' }}
            >
              <div className="p-3 flex flex-col gap-1 h-full overflow-y-auto">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Quick Load</p>
                  <button onClick={() => setShowRecents(false)} className="p-1 rounded hover:bg-white/10" style={{ color: 'var(--text-muted)' }}>
                    <X size={13} />
                  </button>
                </div>
                {commonMolecules.slice(0, 7).map(mol => (
                  <button key={mol.name} onClick={() => loadFromSMILES(mol.smiles)} className="text-left px-2.5 py-1.5 rounded-xl hover:bg-white/5 transition-colors w-full">
                    <div className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{mol.name}</div>
                    <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{mol.formula}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button (Desktop only) */}
        <button
          onClick={() => setShowRecents(p => !p)}
          className="flex-shrink-0 w-6 hidden md:flex items-center justify-center hover:bg-white/5 transition-colors"
          style={{ borderLeft: showRecents ? 'none' : '1px solid var(--border)', color: 'var(--text-muted)' }}
        >
          <motion.div animate={{ rotate: showRecents ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight size={14} />
          </motion.div>
        </button>

      </div>
    </>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="molecule-loader" /></div>}>
      <ChatContent />
    </Suspense>
  );
}
