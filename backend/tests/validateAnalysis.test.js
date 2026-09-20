import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateAnalysis } from '../services/ai/analyzeDocument.js';

test('validateAnalysis: throws on missing attentionAreas', () => {
  assert.throws(() => validateAnalysis({ summary: 'x' }), (err) => err.code === 'AI_INVALID_RESPONSE');
});

test('validateAnalysis: throws on non-object input', () => {
  assert.throws(() => validateAnalysis(null), (err) => err.code === 'AI_INVALID_RESPONSE');
});

test('validateAnalysis: drops findings without an originalClause (hallucination guard)', () => {
  const result = validateAnalysis({
    attentionAreas: [
      { category: 'Termination', originalClause: '30 days notice required.' },
      { category: 'Liability' }, // missing originalClause -> should be dropped
    ],
  });
  assert.equal(result.attentionAreas.length, 1);
  assert.equal(result.attentionAreas[0].category, 'Termination');
});

test('validateAnalysis: normalizes invalid attention level to LOW', () => {
  const result = validateAnalysis({
    attentionAreas: [{ category: 'Payment', originalClause: 'Pay ₹20,000.', level: 'EXTREME' }],
  });
  assert.equal(result.attentionAreas[0].level, 'LOW');
});

test('validateAnalysis: fills in default obligations shape when missing', () => {
  const result = validateAnalysis({ attentionAreas: [] });
  assert.deepEqual(result.obligations, { user: [], otherParty: [] });
});
