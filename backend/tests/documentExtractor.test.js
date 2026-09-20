import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extractText } from '../services/documentExtractor.js';

function makeFile(originalname, text, mimetype) {
  return {
    originalname,
    mimetype,
    buffer: Buffer.from(text, 'utf-8'),
    size: Buffer.byteLength(text),
  };
}

test('extractText: extracts plain text from a .txt file', async () => {
  const file = makeFile('sample.txt', 'This is a sample contract with enough content to pass validation.', 'text/plain');
  const result = await extractText(file);
  assert.equal(result.filename, 'sample.txt');
  assert.ok(result.text.includes('sample contract'));
});

test('extractText: rejects unsupported file extension', async () => {
  const file = makeFile('sample.exe', 'malicious content', 'application/octet-stream');
  await assert.rejects(() => extractText(file), (err) => err.code === 'UNSUPPORTED_FILE_TYPE');
});

test('extractText: rejects empty/too-short documents', async () => {
  const file = makeFile('empty.txt', 'hi', 'text/plain');
  await assert.rejects(() => extractText(file), (err) => err.code === 'EMPTY_DOCUMENT');
});

test('extractText: truncates extremely long documents', async () => {
  const longText = 'A'.repeat(70000);
  const file = makeFile('long.txt', longText, 'text/plain');
  const result = await extractText(file);
  assert.equal(result.truncated, true);
  assert.ok(result.text.length <= 60000);
});
