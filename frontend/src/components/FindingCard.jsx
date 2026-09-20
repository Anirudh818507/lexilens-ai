import { MapPin, ChevronRight } from 'lucide-react';
import AttentionBadge from './AttentionBadge';

export default function FindingCard({ finding, onView }) {
  return (
    <div className="rounded-xl border border-ink-200 bg-paper-50 p-5 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-base text-ink-900">{finding.category}</h3>
        <AttentionBadge level={finding.level} size="sm" />
      </div>

      <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-500">
        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
        {finding.section && finding.section !== 'Not specified in the provided document.'
          ? `Section ${finding.section}`
          : 'Section not specified'}
        {finding.page ? ` · Page ${finding.page}` : ''}
      </p>

      <p className="mt-3 line-clamp-3 text-sm italic text-ink-700">&ldquo;{finding.originalClause}&rdquo;</p>

      <button
        onClick={() => onView(finding)}
        className="mt-4 flex items-center gap-1 text-sm font-medium text-brass-600 hover:text-brass-500"
      >
        View evidence
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
