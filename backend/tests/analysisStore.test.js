import { test } from 'node:test';
import assert from 'node:assert/strict';
import { saveAnalysis, getAnalysis, deleteAnalysis } from '../services/analysisStore.js';

test('analysisStore: saves and retrieves an entry', () => {
  saveAnalysis('test-id-1', { documentText: 'hello', analysis: { foo: 'bar' } });
  const entry = getAnalysis('test-id-1');
  assert.ok(entry);
  assert.equal(entry.documentText, 'hello');
  deleteAnalysis('test-id-1');
});

test('analysisStore: returns null for unknown id', () => {
  const entry = getAnalysis('does-not-exist');
  assert.equal(entry, null);
});

test('analysisStore: delete removes an entry', () => {
  saveAnalysis('test-id-2', { documentText: 'hi', analysis: {} });
  deleteAnalysis('test-id-2');
  assert.equal(getAnalysis('test-id-2'), null);
});
