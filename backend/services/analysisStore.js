// In-memory store keyed by analysisId. Holds extracted document text + analysis result
// just long enough for the user's session (Q&A, checklist, etc. reuse it instead of
// re-uploading the document or re-running analysis).
// This intentionally avoids adding a database, per project constraints.
// Entries expire automatically to limit how long sensitive document text is retained in memory.

const store = new Map();
const TTL_MS = 30 * 60 * 1000; // 30 minutes

export function saveAnalysis(id, data) {
  store.set(id, { ...data, createdAt: Date.now() });
}

export function getAnalysis(id) {
  const entry = store.get(id);
  if (!entry) return null;
  if (Date.now() - entry.createdAt > TTL_MS) {
    store.delete(id);
    return null;
  }
  return entry;
}

export function deleteAnalysis(id) {
  store.delete(id);
}

// Periodic cleanup of expired entries
setInterval(() => {
  const now = Date.now();
  for (const [id, entry] of store.entries()) {
    if (now - entry.createdAt > TTL_MS) store.delete(id);
  }
}, 5 * 60 * 1000).unref();
