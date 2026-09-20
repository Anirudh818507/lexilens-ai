import { test } from 'node:test';
import assert from 'node:assert/strict';
import { answerDocumentQuestion } from '../services/ai/answerDocumentQuestion.js';

test('answerDocumentQuestion: rejects empty question before calling AI', async () => {
  await assert.rejects(
    () => answerDocumentQuestion('some document text', ''),
    (err) => err.code === 'VALIDATION_ERROR'
  );
});

test('answerDocumentQuestion: rejects whitespace-only question', async () => {
  await assert.rejects(
    () => answerDocumentQuestion('some document text', '   '),
    (err) => err.code === 'VALIDATION_ERROR'
  );
});

test('answerDocumentQuestion: rejects overly long question', async () => {
  const longQuestion = 'why? '.repeat(200);
  await assert.rejects(
    () => answerDocumentQuestion('some document text', longQuestion),
    (err) => err.code === 'VALIDATION_ERROR'
  );
});
