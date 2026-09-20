import { useState } from 'react';
import { Send, FileSearch, Loader2 } from 'lucide-react';
import { askQuestion, ApiError } from '../../services/api';

const SUGGESTED = [
  'What happens if I terminate early?',
  'How much notice is required?',
  'Does this contract automatically renew?',
  'Who owns the intellectual property?',
  'Who is responsible for damages?',
];

export default function AskDocumentTab({ analysisId }) {
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState([]); // { question, answer, found, sourceSection, sourceQuote }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (q) => {
    const text = (q ?? question).trim();
    if (!text) {
      setError('Please enter a question.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await askQuestion(analysisId, text);
      setHistory((h) => [{ question: text, ...result }, ...h]);
      setQuestion('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="flex items-center gap-2 font-serif text-xl text-ink-900">
        <FileSearch className="h-5 w-5 text-brass-600" aria-hidden="true" />
        Ask your document
      </h2>
      <p className="mt-1 text-sm text-ink-600">
        Ask a question and get an answer grounded only in this document. If it's not covered, we'll say so.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="mt-5 flex flex-col gap-2 sm:flex-row"
      >
        <label htmlFor="doc-question" className="sr-only">
          Ask a question about this document
        </label>
        <input
          id="doc-question"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. How much notice is required to terminate?"
          className="flex-1 rounded-md border border-ink-300 bg-paper-50 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brass-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-md bg-ink-900 px-5 py-2.5 text-sm font-medium text-paper-50 hover:bg-ink-800 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Ask
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-2 text-sm font-medium text-attention-high">
          {error}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTED.map((s) => (
          <button
            key={s}
            onClick={() => submit(s)}
            disabled={loading}
            className="rounded-full border border-ink-200 bg-paper-100 px-3 py-1.5 text-xs text-ink-600 hover:border-brass-500/50 hover:text-ink-900 disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {history.map((h, i) => (
          <div key={i} className="rounded-xl border border-ink-200 bg-paper-50 p-4">
            <p className="text-sm font-semibold text-ink-900">{h.question}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">{h.answer}</p>
            {h.found && h.sourceSection && (
              <div className="mt-3 rounded-lg bg-paper-100 px-3 py-2">
                <p className="text-xs font-medium uppercase tracking-wide text-brass-600">
                  Source: {h.sourceSection}
                </p>
                {h.sourceQuote && <p className="mt-1 text-xs italic text-ink-600">&ldquo;{h.sourceQuote}&rdquo;</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
