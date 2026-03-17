'use client';
import { motion } from 'framer-motion';
import { Bot, User, Copy, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';
import type { ChatMessage } from '@/types';
import toast from 'react-hot-toast';

interface ChatBubbleProps {
  message: ChatMessage;
  isLatest?: boolean;
}

export function ChatBubble({ message, isLatest }: ChatBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? 'bg-gradient-to-br from-blue-500 to-purple-600'
            : 'bg-gradient-to-br from-teal-500 to-emerald-600'
        }`}
      >
        {isUser ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] relative group ${isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
        {isUser ? (
          <p className="text-sm text-white leading-relaxed">{message.content}</p>
        ) : (
          <div
            className="text-sm leading-relaxed prose prose-sm max-w-none"
            style={{ color: 'var(--text-primary)' }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: ({ children, className }) => {
                  const isBlock = className?.includes('language-');
                  return isBlock ? (
                    <pre className="rounded-lg p-3 text-xs overflow-x-auto my-2"
                      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                      <code style={{ color: '#22d3ee' }}>{children}</code>
                    </pre>
                  ) : (
                    <code className="px-1.5 py-0.5 rounded text-xs font-mono"
                      style={{ background: 'var(--bg-secondary)', color: '#22d3ee' }}>
                      {children}
                    </code>
                  );
                },
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    {children}
                  </a>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
            {message.isStreaming && (
              <span className="inline-block w-1.5 h-4 bg-blue-400 animate-pulse ml-0.5 align-middle rounded-sm" />
            )}
          </div>
        )}

        {/* Timestamp + Copy */}
        <div className={`flex items-center gap-2 mt-1.5 ${isUser ? 'justify-start' : 'justify-end'}`}>
          <span className="text-xs opacity-50" style={{ color: isUser ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {!message.isStreaming && !isUser && (
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: 'var(--text-muted)' }}
            >
              {copied ? <CheckCircle2 size={11} className="text-teal-400" /> : <Copy size={11} />}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
