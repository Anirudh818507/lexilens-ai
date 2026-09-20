import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

const SAMPLE_FINDINGS = [
  { category: 'Termination', level: 'HIGH', note: '30 days\u2019 written notice required' },
  { category: 'Automatic renewal', level: 'MEDIUM', note: 'Renews monthly unless cancelled' },
  { category: 'Confidentiality', level: 'LOW', note: 'Standard 2-year confidentiality term' },
];

const LEVEL_META = {
  HIGH: { icon: AlertTriangle, text: 'text-attention-high', bg: 'bg-attention-highBg' },
  MEDIUM: { icon: AlertCircle, text: 'text-attention-medium', bg: 'bg-attention-mediumBg' },
  LOW: { icon: Info, text: 'text-attention-low', bg: 'bg-attention-lowBg' },
};

export default function HeroPreview() {
  return (
    <div
      aria-hidden="true"
      className="w-full rounded-2xl border border-ink-200 bg-paper-50 p-5 shadow-[0_20px_60px_-25px_rgba(15,23,32,0.35)] sm:p-6"
    >
      <div className="flex items-center justify-between border-b border-ink-200 pb-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-brass-600">Before you sign</p>
          <p className="font-serif text-sm text-ink-900">Freelance_Service_Agreement.pdf</p>
        </div>
        <span className="attention-badge bg-attention-highBg text-attention-high text-[10px]">
          <AlertTriangle className="h-3 w-3" /> HIGH ATTENTION
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-attention-highBg px-2 py-2">
          <p className="text-lg font-semibold text-attention-high">2</p>
          <p className="text-[10px] text-attention-high">High</p>
        </div>
        <div className="rounded-lg bg-attention-mediumBg px-2 py-2">
          <p className="text-lg font-semibold text-attention-medium">3</p>
          <p className="text-[10px] text-attention-medium">Medium</p>
        </div>
        <div className="rounded-lg bg-attention-lowBg px-2 py-2">
          <p className="text-lg font-semibold text-attention-low">2</p>
          <p className="text-[10px] text-attention-low">Low</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {SAMPLE_FINDINGS.map((f) => {
          const meta = LEVEL_META[f.level];
          const Icon = meta.icon;
          return (
            <div key={f.category} className="flex items-center gap-2.5 rounded-lg border border-ink-200/70 px-3 py-2">
              <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${meta.bg}`}>
                <Icon className={`h-3.5 w-3.5 ${meta.text}`} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-ink-900">{f.category}</p>
                <p className="truncate text-[11px] text-ink-500">{f.note}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
