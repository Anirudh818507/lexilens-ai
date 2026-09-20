import { Link } from 'react-router-dom';
import {
  FileSearch, Sparkles, UploadCloud, BrainCircuit, BookOpenCheck, ClipboardCheck,
  Eye, Languages, ScrollText, MessageSquareText, GitCompareArrows, ListChecks, ShieldCheck, Lock,
} from 'lucide-react';
import HeroPreview from '../components/HeroPreview';

const STEPS = [
  { icon: UploadCloud, title: 'Upload', text: 'Add a PDF, DOCX, or TXT contract — or try the built-in sample in one click.' },
  { icon: BrainCircuit, title: 'AI analyzes', text: 'The document is read clause by clause to surface what deserves attention.' },
  { icon: BookOpenCheck, title: 'Understand', text: 'See plain-language explanations, evidence, and why each clause may matter.' },
  { icon: ClipboardCheck, title: 'Act', text: 'Walk away with a checklist and questions ready for a legal professional.' },
];

const FEATURES = [
  { icon: Eye, title: 'Before you sign', text: 'Proactive findings, not a chatbot waiting for questions — we tell you what to look at first.' },
  { icon: Languages, title: 'Plain language', text: 'Toggle between the original clause and a beginner-friendly explanation, side by side.' },
  { icon: ScrollText, title: 'Evidence-first analysis', text: 'Every finding is traceable to the exact clause in your document — never invented.' },
  { icon: MessageSquareText, title: 'Document Q&A', text: 'Ask direct questions and get answers grounded only in your document, with sources.' },
  { icon: GitCompareArrows, title: 'Compare contracts', text: 'See what changed between two versions of a document — added, removed, or modified.' },
  { icon: ListChecks, title: 'Action checklist', text: 'An automatically generated, exportable checklist of things worth confirming before you sign.' },
];

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-ink-200/70 bg-paper-50">
        <div className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full border border-brass-500/30 bg-brass-400/10 px-3 py-1 text-xs font-medium text-brass-600">
              GenAI-powered legal document review
            </p>
            <h1 className="mt-5 font-serif text-4xl leading-tight text-ink-900 sm:text-5xl">
              Before you sign,
              <br />
              know what you're agreeing to.
            </h1>
            <p className="mt-5 max-w-lg text-ink-600">
              Turn complex legal documents into clear, actionable insights — so you know what deserves attention
              before you sign.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/analyze"
                className="flex items-center justify-center gap-2 rounded-md bg-ink-900 px-6 py-3 text-sm font-medium text-paper-50 transition-colors hover:bg-ink-800"
              >
                <FileSearch className="h-4 w-4" aria-hidden="true" />
                Analyze my document
              </Link>
              <Link
                to="/analyze"
                className="flex items-center justify-center gap-2 rounded-md border border-brass-500/50 bg-paper-50 px-6 py-3 text-sm font-medium text-ink-800 transition-colors hover:bg-brass-400/10"
              >
                <Sparkles className="h-4 w-4 text-brass-600" aria-hidden="true" />
                Try sample contract
              </Link>
            </div>
          </div>
          <HeroPreview />
        </div>
      </section>

      {/* Problem */}
      <section className="border-b border-ink-200/70 bg-paper-100">
        <div className="container-page py-16">
          <p className="text-sm font-medium uppercase tracking-wide text-brass-600">The problem</p>
          <h2 className="mt-2 max-w-2xl font-serif text-2xl text-ink-900 sm:text-3xl">
            Legal documents are full of details that are easy to miss — until they matter.
          </h2>
          <p className="mt-4 max-w-2xl text-ink-600">
            Employment contracts, rental agreements, freelance deals, NDAs, and insurance documents often bury
            important obligations, automatic renewals, penalties, and liability terms in dense language. Most
            people sign without a clear picture of what they've agreed to.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-ink-200/70 bg-paper-50">
        <div className="container-page py-16">
          <p className="text-sm font-medium uppercase tracking-wide text-brass-600">How it works</p>
          <h2 className="mt-2 font-serif text-2xl text-ink-900 sm:text-3xl">From upload to understanding, in minutes</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative rounded-xl border border-ink-200 bg-paper-50 p-5">
                <span className="font-serif text-3xl text-paper-200" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <s.icon className="mt-1 h-5 w-5 text-brass-600" aria-hidden="true" />
                <h3 className="mt-3 font-serif text-base text-ink-900">{s.title}</h3>
                <p className="mt-1.5 text-sm text-ink-600">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-ink-200/70 bg-paper-100">
        <div className="container-page py-16">
          <p className="text-sm font-medium uppercase tracking-wide text-brass-600">Features</p>
          <h2 className="mt-2 font-serif text-2xl text-ink-900 sm:text-3xl">Built around one question</h2>
          <p className="mt-2 max-w-2xl text-ink-600">"What should I pay attention to before I sign this?"</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-ink-200 bg-paper-50 p-5">
                <f.icon className="h-5 w-5 text-brass-600" aria-hidden="true" />
                <h3 className="mt-3 font-serif text-base text-ink-900">{f.title}</h3>
                <p className="mt-1.5 text-sm text-ink-600">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Privacy */}
      <section className="bg-paper-50">
        <div className="container-page py-16">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-ink-200 bg-paper-100 p-6">
              <ShieldCheck className="h-6 w-6 text-brass-600" aria-hidden="true" />
              <h3 className="mt-3 font-serif text-lg text-ink-900">Built with security in mind</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                File type and size validation, request rate limiting, and server-side-only API keys. Uploaded files
                are processed in memory and are not permanently stored.
              </p>
            </div>
            <div className="rounded-xl border border-ink-200 bg-paper-100 p-6">
              <Lock className="h-6 w-6 text-brass-600" aria-hidden="true" />
              <h3 className="mt-3 font-serif text-lg text-ink-900">Treat your document as sensitive</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                Your document is processed for analysis and should be treated as sensitive information. Avoid
                uploading documents containing information you are not authorized to share.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
