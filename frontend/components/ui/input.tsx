'use client';
import { cn } from '@/lib/utils';
import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Input({ label, error, leftIcon, rightIcon, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
            {leftIcon}
          </div>
        )}
        <input
          className={cn(
            'input-neon w-full px-4 py-2.5 rounded-xl text-sm',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-red-500/50 focus:border-red-500',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs mt-1 text-red-400">{error}</p>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'input-neon w-full px-4 py-3 rounded-xl text-sm resize-none',
          error && 'border-red-500/50',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs mt-1 text-red-400">{error}</p>}
    </div>
  );
}
