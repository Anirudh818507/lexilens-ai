import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateChecklist, generateLawyerQuestions } from '../services/ai/generateChecklist.js';

const mockAnalysis = {
  attentionAreas: [
    {
      id: 'finding-1',
      category: 'Termination',
      level: 'HIGH',
      whatToCheck: 'Confirm notice period obligations',
      lawyerQuestion: 'Can the notice requirement be waived?',
    },
    {
      id: 'finding-2',
      category: 'Automatic Renewal',
      level: 'MEDIUM',
      whatToCheck: 'Confirm notice period obligations', // duplicate on purpose
      lawyerQuestion: 'What happens if I miss the non-renewal deadline?',
    },
    {
      id: 'finding-3',
      category: 'Liability',
      level: 'HIGH',
      whatToCheck: 'Not specified in the provided document.',
      lawyerQuestion: 'Not specified in the provided document.',
    },
  ],
  obligations: { user: [], otherParty: [] },
};

test('generateChecklist: produces one item per unique check plus baseline items', () => {
  const checklist = generateChecklist(mockAnalysis);
  const labels = checklist.map((c) => c.label.toLowerCase());
  // duplicate "confirm notice period obligations" should only appear once
  const dupCount = labels.filter((l) => l === 'confirm notice period obligations').length;
  assert.equal(dupCount, 1);
  assert.ok(checklist.some((c) => c.category === 'General'));
});

test('generateChecklist: falls back to category label when whatToCheck is unspecified', () => {
  const checklist = generateChecklist(mockAnalysis);
  assert.ok(checklist.some((c) => c.label === 'Review the Liability clause'));
});

test('generateLawyerQuestions: filters out unspecified questions and dedupes', () => {
  const questions = generateLawyerQuestions(mockAnalysis);
  assert.equal(questions.length, 2);
  assert.ok(!questions.some((q) => q.question === 'Not specified in the provided document.'));
});
