'use client';
import { motion } from 'framer-motion';
import { ChevronRight, CheckCircle2, Clock, XCircle } from 'lucide-react';
import type { Experiment } from '@/types';
import { timeAgo } from '@/lib/utils';

interface ExperimentCardProps {
  experiment: Experiment;
  onClick?: () => void;
  delay?: number;
}

const STATUS_CONFIG = {
  completed: { icon: CheckCircle2, color: '#22c55e', label: 'Completed' },
  pending:   { icon: Clock,        color: '#f59e0b', label: 'Pending'   },
  running:   { icon: Clock,        color: '#3b82f6', label: 'Running'   },
  failed:    { icon: XCircle,      color: '#ef4444', label: 'Failed'    },
};

const TYPE_LABELS: Record<string, string> = {
  reaction_prediction: 'Reaction Predictor',
  toxicity:            'Toxicity Analysis',
  similarity:          'Similarity Search',
  drug_analysis:       'Drug Analysis',
};

export function ExperimentCard({ experiment, onClick, delay = 0 }: ExperimentCardProps) {
  const status = STATUS_CONFIG[experiment.status] || STATUS_CONFIG.pending;
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -2, scale: 1.01 }}
      onClick={onClick}
      className="experiment-card group"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5"
          style={{
            background: `${status.color}15`,
            border: `1px solid ${status.color}40`,
            color: status.color,
          }}
        >
          <StatusIcon size={11} />
          {status.label}
        </div>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {timeAgo(experiment.createdAt)}
        </span>
      </div>

      <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
        {experiment.title}
      </h3>
      <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
        {TYPE_LABELS[experiment.type] || experiment.type}
      </p>

      {onClick && (
        <div className="flex items-center gap-1 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
          View results <ChevronRight size={12} />
        </div>
      )}
    </motion.div>
  );
}
