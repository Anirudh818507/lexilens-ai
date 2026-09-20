import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { FileText, LayoutDashboard, AlertOctagon, ListChecks, FileSearch, ClipboardList, Scale } from 'lucide-react';
import { useAnalysis } from '../hooks/useAnalysis';
import OverviewTab from '../components/dashboard/OverviewTab';
import AttentionAreasTab from '../components/dashboard/AttentionAreasTab';
import ObligationsTab from '../components/dashboard/ObligationsTab';
import AskDocumentTab from '../components/dashboard/AskDocumentTab';
import ChecklistTab from '../components/dashboard/ChecklistTab';
import LawyerQuestionsTab from '../components/dashboard/LawyerQuestionsTab';

const TABS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'attention', label: 'Attention areas', icon: AlertOctagon },
  { key: 'obligations', label: 'Obligations', icon: ListChecks },
  { key: 'ask', label: 'Ask document', icon: FileSearch },
  { key: 'checklist', label: 'Checklist', icon: ClipboardList },
  { key: 'lawyer', label: 'Lawyer questions', icon: Scale },
];

export default function Dashboard() {
  const { analysis } = useAnalysis();
  const [tab, setTab] = useState('overview');

  if (!analysis) {
    // No analysis in memory (e.g. page refresh) — send the user back to analyze a document.
    return <Navigate to="/analyze" replace />;
  }

  return (
    <div className="container-page py-8">
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-brass-600">
        <FileText className="h-3.5 w-3.5" aria-hidden="true" />
        Document: {analysis.filename}
      </div>
      <h1 className="font-serif text-3xl text-ink-900">Before you sign</h1>
      <p className="mt-1 text-sm text-ink-600">
        This is an AI-assisted, informational review — not legal advice.{' '}
        <Link to="/about" className="underline hover:text-ink-900">Learn what this does and doesn't do.</Link>
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Dashboard sections" className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                aria-current={active ? 'page' : undefined}
                className={`flex flex-shrink-0 items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  active ? 'bg-ink-900 text-paper-50' : 'text-ink-600 hover:bg-paper-100'
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <span className="whitespace-nowrap">{t.label}</span>
              </button>
            );
          })}
        </nav>

        <div>
          {tab === 'overview' && <OverviewTab analysis={analysis} />}
          {tab === 'attention' && <AttentionAreasTab analysis={analysis} />}
          {tab === 'obligations' && <ObligationsTab analysis={analysis} />}
          {tab === 'ask' && <AskDocumentTab analysisId={analysis.analysisId} />}
          {tab === 'checklist' && <ChecklistTab analysisId={analysis.analysisId} />}
          {tab === 'lawyer' && <LawyerQuestionsTab analysisId={analysis.analysisId} />}
        </div>
      </div>
    </div>
  );
}
