import { useEffect, useState } from 'react';
import { ClipboardList, Copy, Download, Loader2 } from 'lucide-react';
import { getChecklist } from '../../services/api';
import { useAnalysis } from '../../hooks/useAnalysis';
import { useToast } from '../Toast';

export default function ChecklistTab({ analysisId }) {
  const { checklistData, setChecklistData } = useAnalysis();
  const [loading, setLoading] = useState(!checklistData);
  const [error, setError] = useState('');
  const [checked, setChecked] = useState({});
  const { showToast } = useToast();

  useEffect(() => {
    if (checklistData) return; // already cached — avoid a duplicate API call
    let cancelled = false;
    setLoading(true);
    getChecklist(analysisId)
      .then((data) => {
        if (!cancelled) setChecklistData(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Could not load checklist.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [analysisId, checklistData, setChecklistData]);

  const toggle = (id) => setChecked((c) => ({ ...c, [id]: !c[id] }));

  const copyChecklist = async () => {
    const text = checklistData.checklist
      .map((item) => `${checked[item.id] ? '[x]' : '[ ]'} ${item.label}`)
      .join('\n');
    try {
      await navigator.clipboard.writeText(text);
      showToast('Checklist copied to clipboard.', 'success');
    } catch {
      showToast('Could not copy to clipboard.', 'error');
    }
  };

  const downloadChecklist = () => {
    const text = checklistData.checklist
      .map((item) => `${checked[item.id] ? '[x]' : '[ ]'} ${item.label}`)
      .join('\n');
    const blob = new Blob([`BEFORE YOU SIGN CHECKLIST\n\n${text}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'before-you-sign-checklist.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-ink-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Preparing your checklist…
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
          <ClipboardList className="h-5 w-5 text-brass-600" aria-hidden="true" />
          Before you sign checklist
        </h2>
        <div className="flex gap-2">
          <button
            onClick={copyChecklist}
            className="flex items-center gap-1.5 rounded-md border border-ink-200 px-3 py-1.5 text-sm text-ink-700 hover:bg-paper-100"
          >
            <Copy className="h-3.5 w-3.5" /> Copy
          </button>
          <button
            onClick={downloadChecklist}
            className="flex items-center gap-1.5 rounded-md border border-ink-200 px-3 py-1.5 text-sm text-ink-700 hover:bg-paper-100"
          >
            <Download className="h-3.5 w-3.5" /> Download
          </button>
        </div>
      </div>

      <ul className="mt-5 divide-y divide-ink-200 rounded-xl border border-ink-200 bg-paper-50">
        {checklistData.checklist.map((item) => (
          <li key={item.id} className="flex items-start gap-3 px-4 py-3">
            <input
              type="checkbox"
              id={item.id}
              checked={!!checked[item.id]}
              onChange={() => toggle(item.id)}
              className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-ink-300 text-brass-600 focus:ring-brass-500"
            />
            <label
              htmlFor={item.id}
              className={`text-sm ${checked[item.id] ? 'text-ink-400 line-through' : 'text-ink-800'}`}
            >
              {item.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
