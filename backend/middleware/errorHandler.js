// Central error handling. Never leak stack traces or internal details to clients.

export function notFound(req, res, next) {
  res.status(404).json({ error: 'Not found', code: 'NOT_FOUND' });
}

export function errorHandler(err, req, res, next) {
  // Log full detail server-side only (never log document content, only metadata)
  // eslint-disable-next-line no-console
  console.error(`[LexiLens] Error on ${req.method} ${req.path}:`, err.message);

  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';

  const safeMessages = {
    FILE_TOO_LARGE: 'The uploaded file exceeds the maximum allowed size (10MB).',
    UNSUPPORTED_FILE_TYPE: 'Unsupported file type. Please upload a PDF, DOCX, or TXT file.',
    EMPTY_DOCUMENT: 'No readable text was found in this document.',
    EXTRACTION_FAILED: 'We could not extract text from this file. It may be corrupted or scanned as an image.',
    AI_CONFIG_ERROR: 'The AI service is not configured on the server.',
    AI_TIMEOUT: 'The AI service took too long to respond. Please try again.',
    AI_INVALID_RESPONSE: 'The AI service returned an unexpected response. Please try again.',
    AI_ERROR: 'The AI service encountered an error. Please try again shortly.',
    VALIDATION_ERROR: err.message && err.status === 400 ? err.message : 'Invalid request.',
    RATE_LIMITED: 'Too many requests. Please wait a moment and try again.',
    NOT_FOUND: 'The requested resource was not found.',
  };

  const message = safeMessages[code] || 'Something went wrong while processing your request.';

  res.status(status).json({ error: message, code });
}

export class AppError extends Error {
  constructor(message, status = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.status = status;
    this.code = code;
  }
}
