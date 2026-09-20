import { CheckCircle2, XCircle, BrainCircuit, Lock, AlertTriangle, Scale } from 'lucide-react';

export default function About() {
  return (
    <div className="container-page py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wide text-brass-600">About LexiLens AI</p>
        <h1 className="mt-2 font-serif text-3xl text-ink-900 sm:text-4xl">
          A "before you sign" companion — not a lawyer
        </h1>

        <Section icon={CheckCircle2} title="What LexiLens AI does">
          <p>
            LexiLens AI reads legal documents you upload — employment contracts, rental agreements, freelance
            agreements, NDAs, and similar documents — and identifies clauses that commonly deserve attention:
            termination terms, automatic renewals, liability limits, confidentiality obligations, IP ownership, and
            more. It explains each clause in plain language, shows the original text as evidence, and generates a
            checklist and questions you could bring to a legal professional.
          </p>
        </Section>

        <Section icon={XCircle} title="What it does NOT do">
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>It does not give legal advice or tell you whether to sign.</li>
            <li>It does not say a document is "legal," "safe," or "risk-free."</li>
            <li>It does not replace a qualified lawyer for anything binding or high-stakes.</li>
            <li>It does not invent clauses, laws, or facts not present in your document.</li>
          </ul>
        </Section>

        <Section icon={BrainCircuit} title="How AI is used">
          <p>
            LexiLens AI uses Google's Gemini API on the backend only. Your document text is sent to the AI model
            with strict instructions to use only the content of your document, to flag anything not covered, and to
            return structured, evidence-backed findings rather than free-form legal opinions.
          </p>
        </Section>

        <Section icon={Lock} title="Privacy">
          <p>
            Your document is processed for analysis and should be treated as sensitive information. Files are
            processed in memory on the server and are not permanently stored; analyzed text is kept only briefly, in
            memory, so you can ask follow-up questions, and is not written to a database. Avoid uploading documents
            containing information you are not authorized to share.
          </p>
        </Section>

        <Section icon={AlertTriangle} title="Limitations">
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            <li>AI-generated analysis may be incomplete, miss context, or misinterpret unusual phrasing.</li>
            <li>Very long documents are truncated to a reasonable length for analysis.</li>
            <li>Scanned or image-only PDFs without extractable text cannot currently be analyzed.</li>
            <li>Analysis quality depends on the clarity of the source document.</li>
          </ul>
        </Section>

        <Section icon={Scale} title="Legal disclaimer">
          <p>
            LexiLens AI provides educational and informational assistance and is not a substitute for professional
            legal advice. AI-generated analysis may be incomplete or inaccurate. Consult a qualified legal
            professional for advice about your specific situation.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <section className="mt-8">
      <h2 className="flex items-center gap-2 font-serif text-lg text-ink-900">
        <Icon className="h-5 w-5 text-brass-600" aria-hidden="true" />
        {title}
      </h2>
      <div className="mt-2 text-sm leading-relaxed text-ink-600">{children}</div>
    </section>
  );
}
