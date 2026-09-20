import { levelConfig } from '../utils/attentionLevels';

export default function AttentionBadge({ level, size = 'md' }) {
  const cfg = levelConfig(level);
  const Icon = cfg.icon;
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span className={`attention-badge ${cfg.bg} ${cfg.text} ${sizeClasses}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {cfg.label.toUpperCase()}
    </span>
  );
}
