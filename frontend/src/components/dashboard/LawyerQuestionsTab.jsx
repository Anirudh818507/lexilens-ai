import { useEffect, useState } from 'react';
import { Scale, Copy, Loader2 } from 'lucide-react';
import { getChecklist } from '../../services/api';
import { useAnalysis } from '../../hooks/useAnalysis';
import { useToast } from '../Toast';
import AttentionBadge from '../AttentionBadge';

export default function LawyerQuestionsTab({ analysisId }) {
  const { checklistData, setChecklistData } = useAnalysis();
  const [loading, setLoading] = useState(!checklistData);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    if (checklistData) return; // reuse cached result — no duplicate AI/API call
    let cancelled = false;
    setLoading(true);
    getChecklist(analysisId)
      .then((data) => {
        if (!cancelled) setChecklistData(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Could not load questions.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [analysisId, checklistData, setChecklistData]);

  const copyQuestions = async () => {
    const text = checklistData.lawyerQuestions.map((q, i) => `${i + 1}. ${q.question}`).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      showToast('Questions copied to clipboard.', 'success');
    } catch {
      showToast('Could not copy to clipboard.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-ink-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Preparing questions…
      </div>
    );
  }

  if (error) {
    return (
      <p role="alert" className="text-sm font-medium text-attention-high">
        {error}
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-serif text-xl text-ink-900">
          <Scale className="h-5 w-5 text-brass-600" aria-hidden="true" />
          Questions to ask a lawyer
        </h2>
        <button
          onClick={copyQuestions}
          className="flex items-center gap-1.5 rounded-md border border-ink-200 px-3 py-1.5 text-sm text-ink-700 hover:bg-paper-100"
        >
          <Copy className="h-3.5 w-3.5" /> Copy questions
        </button>
      </div>
      <p className="mt-1 text-sm text-ink-600">
        Questions to consider bringing to a qualified legal professional, generated from the clauses identified above.
      </p>

      <ol className="mt-5 space-y-3">
        {checklistData.lawyerQuestions.map((q, i) => (
          <li key={q.id} className="flex items-start gap-3 rounded-xl border border-ink-200 bg-paper-50 p-4">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-paper-200 text-xs font-semibold text-ink-700">
              {i + 1}
            </span>
            <div>
              <p className="text-sm text-ink-800">{q.question}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-xs text-ink-500">{q.category}</span>
                <AttentionBadge level={q.level} size="sm" />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
