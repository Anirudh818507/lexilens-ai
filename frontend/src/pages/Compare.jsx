import { useState } from 'react';
import { GitCompareArrows, Loader2, PlusCircle, MinusCircle, RefreshCcw } from 'lucide-react';
import UploadZone, { FilePreview } from '../components/UploadZone';
import { compareDocuments, ApiError } from '../services/api';

const CHANGE_META = {
  Added: { icon: PlusCircle, text: 'text-attention-low', bg: 'bg-attention-lowBg' },
  Removed: { icon: MinusCircle, text: 'text-attention-high', bg: 'bg-attention-highBg' },
  Modified: { icon: RefreshCcw, text: 'text-attention-medium', bg: 'bg-attention-mediumBg' },
};

export default function Compare() {
  const [fileA, setFileA] = useState(null);
  const [fileB, setFileB] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const runCompare = async () => {
    if (!fileA || !fileB) {
      setError('Please provide both documents to compare.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const data = await compareDocuments(fileA, fileB);
      setResult(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Comparison failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-brass-600">Document comparison</p>
        <h1 className="mt-2 font-serif text-3xl text-ink-900 sm:text-4xl">Compare two versions of a document</h1>
        <p className="mt-3 text-ink-600">
          Upload two versions of a contract to see what meaningfully changed — payment, termination, renewal terms,
          and more.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
        <div>
          <h2 className="mb-2 text-sm font-semibold text-ink-800">Document A</h2>
          <UploadZone onFileSelected={setFileA} disabled={loading} />
          {fileA && (
            <div className="mt-3">
              <FilePreview file={fileA} />
            </div>
          )}
        </div>
        <div>
          <h2 className="mb-2 text-sm font-semibold text-ink-800">Document B</h2>
          <UploadZone onFileSelected={setFileB} disabled={loading} />
          {fileB && (
            <div className="mt-3">
              <FilePreview file={fileB} />
            </div>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="mx-auto mt-4 max-w-3xl text-sm font-medium text-attention-high">
          {error}
        </p>
      )}

      <div className="mx-auto mt-6 max-w-3xl">
        <button
          onClick={runCompare}
          disabled={loading || !fileA || !fileB}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-ink-900 px-5 py-3 text-sm font-medium text-paper-50 hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GitCompareArrows className="h-4 w-4" />}
          Compare documents
        </button>
      </div>

      {result && (
        <div className="mx-auto mt-10 max-w-3xl">
          <h2 className="font-serif text-xl text-ink-900">Important changes</h2>
          <p className="mt-1 text-sm text-ink-600">
            Comparing <strong>{result.documentA.filename}</strong> to <strong>{result.documentB.filename}</strong>
          </p>

          {result.changes.length === 0 ? (
            <p className="mt-6 text-sm text-ink-500">No meaningful differences were identified between these documents.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {result.changes.map((c) => {
                const meta = CHANGE_META[c.changeType] || CHANGE_META.Modified;
                const Icon = meta.icon;
                return (
                  <div key={c.id} className="rounded-xl border border-ink-200 bg-paper-50 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-serif text-base text-ink-900">{c.category}</h3>
                      <span className={`attention-badge ${meta.bg} ${meta.text} text-xs`}>
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        {c.changeType.toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg bg-paper-100 p-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Document A</p>
                        <p className="mt-1 text-sm text-ink-800">{c.documentA}</p>
                      </div>
                      <div className="rounded-lg bg-paper-100 p-3">
                        <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Document B</p>
                        <p className="mt-1 text-sm text-ink-800">{c.documentB}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-ink-600">{c.description}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
