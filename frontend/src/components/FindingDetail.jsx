import { useState } from 'react';
import { MapPin, HelpCircle, Eye, CheckSquare } from 'lucide-react';
import AttentionBadge from './AttentionBadge';

export default function FindingDetail({ finding }) {
  const [mode, setMode] = useState('original'); // 'original' | 'simple'

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <AttentionBadge level={finding.level} />
        <span className="flex items-center gap-1.5 text-sm text-ink-500">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {finding.section && finding.section !== 'Not specified in the provided document.'
            ? `Section ${finding.section}`
            : 'Section not specified'}
          {finding.page ? ` · Page ${finding.page}` : ''}
        </span>
      </div>

      {/* Original / Simple toggle */}
      <div role="tablist" aria-label="Clause language view" className="mt-5 inline-flex rounded-lg border border-ink-200 p-1">
        <button
          role="tab"
          aria-selected={mode === 'original'}
          onClick={() => setMode('original')}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            mode === 'original' ? 'bg-ink-900 text-paper-50' : 'text-ink-600 hover:text-ink-900'
          }`}
        >
          Original
        </button>
        <button
          role="tab"
          aria-selected={mode === 'simple'}
          onClick={() => setMode('simple')}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            mode === 'simple' ? 'bg-ink-900 text-paper-50' : 'text-ink-600 hover:text-ink-900'
          }`}
        >
          Simple explanation
        </button>
      </div>

      <div role="tabpanel" className="mt-4 rounded-lg border border-ink-200 bg-paper-100 p-4">
        {mode === 'original' ? (
          <p className="text-sm italic leading-relaxed text-ink-800">&ldquo;{finding.originalClause}&rdquo;</p>
        ) : (
          <p className="text-sm leading-relaxed text-ink-800">{finding.simpleExplanation}</p>
        )}
      </div>

      <div className="mt-6 space-y-5">
        <Section icon={Eye} title="Why it may matter" text={finding.whyItMatters} />
        <Section icon={CheckSquare} title="What to check" text={finding.whatToCheck} />
        <Section icon={HelpCircle} title="Question to consider asking a legal professional" text={finding.lawyerQuestion} />
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, text }) {
  return (
    <div>
      <h4 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
        <Icon className="h-4 w-4 text-brass-600" aria-hidden="true" />
        {title}
      </h4>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{text}</p>
    </div>
  );
}
