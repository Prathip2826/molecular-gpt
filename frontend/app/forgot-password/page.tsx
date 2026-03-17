'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Atom, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error('Enter your email'); return; }
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      toast.success('Password reset email sent!');
    } catch {
      toast.error('Could not send reset email. Check your address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-primary)' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-3">
            <Atom size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-bold gradient-text">Reset Password</h1>
          <p className="text-sm mt-1 text-center" style={{ color: 'var(--text-muted)' }}>
            {sent ? 'Check your inbox for the reset link.' : "Enter your email and we'll send a reset link."}
          </p>
        </div>
        {!sent ? (
          <form onSubmit={handleReset} className="space-y-4">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" className="input-neon w-full px-4 py-3 rounded-xl text-sm" />
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
              disabled={loading} className="btn-neon w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-60">
              {loading && <Loader2 size={16} className="animate-spin" />} Send Reset Link
            </motion.button>
          </form>
        ) : (
          <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.3)' }}>
            <p className="text-sm text-teal-400">Reset email sent to <strong>{email}</strong></p>
          </div>
        )}
        <Link href="/login" className="flex items-center justify-center gap-2 text-xs mt-6 hover:underline" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={12} /> Back to Sign In
        </Link>
      </motion.div>
    </div>
  );
}
