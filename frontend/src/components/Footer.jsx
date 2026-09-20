import { Link } from 'react-router-dom';
import { Scale } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-ink-200/70 bg-paper-100">
      <div className="container-page py-10">
        <div className="flex items-start gap-3 rounded-lg border border-brass-500/30 bg-paper-50 p-4 sm:p-5">
          <Scale className="mt-0.5 h-5 w-5 flex-shrink-0 text-brass-600" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-ink-700">
            <strong className="text-ink-900">Legal disclaimer:</strong> LexiLens AI provides educational and
            informational assistance and is not a substitute for professional legal advice. AI-generated analysis
            may be incomplete or inaccurate. Consult a qualified legal professional for advice about your specific
            situation.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="font-serif text-base text-ink-800">LexiLens AI</div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-600">
            <Link to="/" className="hover:text-ink-900">Home</Link>
            <Link to="/analyze" className="hover:text-ink-900">Analyze</Link>
            <Link to="/compare" className="hover:text-ink-900">Compare</Link>
            <Link to="/about" className="hover:text-ink-900">About</Link>
          </nav>
          <p className="text-xs text-ink-400">Built for PromptWars Virtual — AI for Legal Assistance &amp; Access</p>
        </div>
      </div>
    </footer>
  );
}
