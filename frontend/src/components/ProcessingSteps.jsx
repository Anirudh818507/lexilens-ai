import { Check, Circle, Loader2 } from 'lucide-react';

const STEPS = [
  { key: 'uploading', label: 'Document uploaded' },
  { key: 'extracting', label: 'Text extracted' },
  { key: 'analyzing', label: 'Identifying important clauses' },
  { key: 'preparing', label: 'Preparing your Before You Sign report' },
];

/**
 * currentStep: one of 'uploading' | 'extracting' | 'analyzing' | 'preparing' | 'done'
 * Steps before currentStep are shown complete; the current step shows a spinner;
 * steps after are pending. This reflects real request state passed in by the caller —
 * it does not fabricate progress independently of the actual network request.
 */
export default function ProcessingSteps({ currentStep }) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="rounded-xl border border-ink-200 bg-paper-50 p-6" role="status" aria-live="polite">
      <p className="mb-4 font-serif text-lg text-ink-900">Analyzing your document</p>
      <ul className="space-y-3">
        {STEPS.map((step, idx) => {
          const isDone = currentStep === 'done' || idx < currentIndex;
          const isCurrent = idx === currentIndex && currentStep !== 'done';
          return (
            <li key={step.key} className="flex items-center gap-3 text-sm">
              {isDone ? (
                <Check className="h-4 w-4 flex-shrink-0 text-attention-low" aria-hidden="true" />
              ) : isCurrent ? (
                <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin text-brass-600" aria-hidden="true" />
              ) : (
                <Circle className="h-4 w-4 flex-shrink-0 text-ink-300" aria-hidden="true" />
              )}
              <span className={isDone ? 'text-ink-800' : isCurrent ? 'text-ink-900 font-medium' : 'text-ink-400'}>
                {step.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
