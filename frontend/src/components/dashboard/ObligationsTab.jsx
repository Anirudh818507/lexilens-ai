import { CheckCircle2, User, Users } from 'lucide-react';

export default function ObligationsTab({ analysis }) {
  const { user = [], otherParty = [] } = analysis.obligations || {};

  return (
    <div>
      <h2 className="font-serif text-xl text-ink-900">What you're agreeing to</h2>
      <p className="mt-1 text-sm text-ink-600">Obligations identified for each party, based only on this document.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <ObligationList icon={User} title="Your obligations" items={user} />
        <ObligationList icon={Users} title="Other party's obligations" items={otherParty} />
      </div>
    </div>
  );
}

function ObligationList({ icon: Icon, title, items }) {
  return (
    <div className="rounded-xl border border-ink-200 bg-paper-50 p-5">
      <h3 className="flex items-center gap-2 font-serif text-base text-ink-900">
        <Icon className="h-4 w-4 text-brass-600" aria-hidden="true" />
        {title}
      </h3>
      {items.length ? (
        <ul className="mt-3 space-y-2.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-attention-low" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-ink-500">Not specified in the provided document.</p>
      )}
    </div>
  );
}
