import { AlertTriangle, AlertCircle, Info, ListChecks } from 'lucide-react';

export default function OverviewTab({ analysis }) {
  const { stats, summary, documentType, parties, importantDates } = analysis;

  return (
    <div>
      <div className="rounded-xl border border-ink-200 bg-paper-50 p-6">
        <p className="text-sm font-medium uppercase tracking-wide text-brass-600">Attention overview</p>
        <p className="mt-1 font-serif text-2xl text-ink-900">{stats.overallAttention}</p>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-600">{summary}</p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={ListChecks} label="Important findings" value={stats.totalFindings} tone="ink" />
          <StatCard icon={AlertTriangle} label="High attention" value={stats.high} tone="high" />
          <StatCard icon={AlertCircle} label="Medium attention" value={stats.medium} tone="medium" />
          <StatCard icon={Info} label="Low attention" value={stats.low} tone="low" />
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-ink-200 bg-paper-50 p-5">
          <h3 className="font-serif text-base text-ink-900">Document type</h3>
          <p className="mt-1 text-sm text-ink-700">{documentType}</p>
        </div>
        <div className="rounded-xl border border-ink-200 bg-paper-50 p-5">
          <h3 className="font-serif text-base text-ink-900">Parties</h3>
          {parties?.length ? (
            <ul className="mt-1 space-y-1 text-sm text-ink-700">
              {parties.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-sm text-ink-500">Not specified in the provided document.</p>
          )}
        </div>
      </div>

      {importantDates?.length > 0 && (
        <div className="mt-4 rounded-xl border border-ink-200 bg-paper-50 p-5">
          <h3 className="font-serif text-base text-ink-900">Important dates &amp; durations</h3>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            {importantDates.map((d, i) => (
              <div key={i} className="rounded-lg bg-paper-100 px-3 py-2">
                <dt className="text-xs uppercase tracking-wide text-ink-500">{d.label}</dt>
                <dd className="mt-0.5 text-sm font-medium text-ink-800">{d.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}

const TONE_CLASSES = {
  ink: 'text-ink-900 bg-paper-200',
  high: 'text-attention-high bg-attention-highBg',
  medium: 'text-attention-medium bg-attention-mediumBg',
  low: 'text-attention-low bg-attention-lowBg',
};

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <div className={`rounded-lg p-3.5 ${TONE_CLASSES[tone]}`}>
      <Icon className="h-4 w-4" aria-hidden="true" />
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="text-xs font-medium">{label}</p>
    </div>
  );
}
