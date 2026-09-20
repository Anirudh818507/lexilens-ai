import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

export const LEVEL_CONFIG = {
  HIGH: {
    label: 'High attention',
    icon: AlertTriangle,
    text: 'text-attention-high',
    bg: 'bg-attention-highBg',
    ring: 'ring-attention-high/30',
    dot: 'bg-attention-high',
  },
  MEDIUM: {
    label: 'Medium attention',
    icon: AlertCircle,
    text: 'text-attention-medium',
    bg: 'bg-attention-mediumBg',
    ring: 'ring-attention-medium/30',
    dot: 'bg-attention-medium',
  },
  LOW: {
    label: 'Low attention',
    icon: Info,
    text: 'text-attention-low',
    bg: 'bg-attention-lowBg',
    ring: 'ring-attention-low/30',
    dot: 'bg-attention-low',
  },
};

export function levelConfig(level) {
  return LEVEL_CONFIG[level] || LEVEL_CONFIG.LOW;
}
