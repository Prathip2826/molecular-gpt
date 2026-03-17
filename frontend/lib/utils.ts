import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Tailwind class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format molecular weight
export function formatMW(mw: number | string): string {
  const num = typeof mw === 'string' ? parseFloat(mw) : mw;
  return isNaN(num) ? '—' : `${num.toFixed(2)} g/mol`;
}

// Truncate SMILES string for display
export function truncateSMILES(smiles: string, max = 30): string {
  if (!smiles) return '';
  return smiles.length > max ? smiles.slice(0, max) + '...' : smiles;
}

// Format relative time
export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// Validate SMILES (basic check)
export function isValidSMILES(smiles: string): boolean {
  if (!smiles || smiles.trim().length === 0) return false;
  // Basic SMILES characters
  const validChars = /^[A-Za-z0-9@+\-\[\]()=#$%./\\:*~^]+$/;
  return validChars.test(smiles.trim());
}

// Generate a random molecule color
export function getMoleculeColor(name: string): string {
  const colors = ['#3b82f6', '#a855f7', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// Export chat as text
export function exportChatAsText(messages: Array<{ role: string; content: string; timestamp: string }>): string {
  const lines = ['Molecular GPT — Chat Export', '='.repeat(40), ''];
  messages.forEach((msg) => {
    lines.push(`[${msg.role.toUpperCase()}] ${new Date(msg.timestamp).toLocaleString()}`);
    lines.push(msg.content);
    lines.push('');
  });
  return lines.join('\n');
}

// Download text as file
export function downloadText(content: string, filename: string, type = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Lipinski Rule of Five checker (basic)
export function checkLipinski(mw: number, logP: number, hbd: number, hba: number) {
  return {
    mwPass: mw <= 500,
    logPPass: logP <= 5,
    hbdPass: hbd <= 5,
    hbaPass: hba <= 10,
    oralBioavailability: mw <= 500 && logP <= 5 && hbd <= 5 && hba <= 10,
  };
}
