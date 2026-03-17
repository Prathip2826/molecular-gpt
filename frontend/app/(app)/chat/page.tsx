'use client';
import { useEffect, useRef, useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { useChat } from '@/hooks/useChat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Plus, Copy, Bot, User, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMolecule } from '@/hooks/useMolecule';

function ChatContent() {
  const searchParams = useSearchParams();
  const { messages, isLoading, sendMessage, clearMessages } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { commonMolecules, loadFromSMILES } = useMolecule();

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setInput(q);
      // Auto-send if query param present
      setTimeout(() => {
        sendMessage(q);
        setInput('');
      }, 500);
    }
  }, [searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
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
    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    await sendMessage(msg);
  };

  // Enter = send, Shift+Enter = new line
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
      <div className="flex h-[calc(100vh-4rem)] pt-16">

        {/* Left: Chat History */}
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

          <div className="pt-2">
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

        {/* Center: Chat Messages */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
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

                  {/* Bubble */}
                  <div className={`max-w-[75%] group relative ${
                    msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <div
                        className="prose prose-sm max-w-none text-sm"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                        {msg.isStreaming && (
                          <span className="inline-block w-1.5 h-4 bg-blue-400 animate-pulse ml-0.5 align-middle rounded-sm" />
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-white leading-relaxed">{msg.content}</p>
                    )}

                    {/* Timestamp + Copy */}
                    <div className={`flex items-center gap-2 mt-1.5 ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                      <span className="text-xs opacity-50" style={{ color: msg.role === 'user' ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)' }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {!msg.isStreaming && msg.role === 'assistant' && (
                        <button
                          onClick={() => copyMessage(msg.content)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <Copy size={10} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* AI typing indicator */}
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

          {/* Input Area */}
          <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
            <div
              className="flex gap-2 items-end rounded-2xl p-2"
              style={{
                background: 'var(--bg-glass)',
                border: '1px solid var(--border)',
              }}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about chemistry... (Enter to send, Shift+Enter for new line)"
                rows={1}
                className="flex-1 bg-transparent text-sm resize-none outline-none px-2 py-1.5"
                style={{
                  color: 'var(--text-primary)',
                  minHeight: '36px',
                  maxHeight: '120px',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  lineHeight: '1.5',
                }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="btn-neon p-2.5 rounded-xl disabled:opacity-40 flex-shrink-0"
                style={{ minWidth: '40px', minHeight: '40px' }}
              >
                {isLoading
                  ? <Loader2 size={16} className="animate-spin" />
                  : <Send size={16} />
                }
              </motion.button>
            </div>
            <p className="text-xs mt-1.5 text-center" style={{ color: 'var(--text-muted)' }}>
              ↵ Enter to send · Shift+Enter for new line · Powered by Groq
            </p>
          </div>
        </div>

        {/* Right: Molecule Quick Load */}
        <div
          className="w-44 flex-shrink-0 p-3 hidden xl:flex flex-col gap-1"
          style={{ borderLeft: '1px solid var(--border)' }}
        >
          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
            Quick Load
          </p>
          {commonMolecules.map(mol => (
            <button
              key={mol.name}
              onClick={() => loadFromSMILES(mol.smiles)}
              className="text-left px-2.5 py-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{mol.name}</div>
              <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{mol.formula}</div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="molecule-loader" />
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
