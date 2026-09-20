import { useState } from 'react';
import FindingCard from '../FindingCard';
import FindingDetail from '../FindingDetail';
import Modal from '../Modal';

export default function AttentionAreasTab({ analysis }) {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <h2 className="font-serif text-xl text-ink-900">Important findings</h2>
      <p className="mt-1 text-sm text-ink-600">
        Clauses identified in your document, ordered by how much attention they may deserve.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {analysis.attentionAreas.map((finding) => (
          <FindingCard key={finding.id} finding={finding} onView={setSelected} />
        ))}
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.category || ''}>
        {selected && <FindingDetail finding={selected} />}
      </Modal>
    </div>
  );
}
