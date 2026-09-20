import path from 'path';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';
import { AppError } from '../middleware/errorHandler.js';

const MAX_CHARS = 60000; // chunking guard: keep AI prompts within reasonable token budget

/**
 * Extract plain text from an in-memory uploaded file buffer.
 * Never writes the raw file to disk — processed entirely in memory,
 * and the buffer is discarded once this function returns.
 */
export async function extractText(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  let rawText = '';

  try {
    if (ext === '.pdf') {
      const data = await pdfParse(file.buffer);
      rawText = data.text || '';
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      rawText = result.value || '';
    } else if (ext === '.txt') {
      rawText = file.buffer.toString('utf-8');
    } else {
      throw new AppError('Unsupported file type', 400, 'UNSUPPORTED_FILE_TYPE');
    }
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError('Failed to extract text from document', 422, 'EXTRACTION_FAILED');
  }

  const cleaned = rawText.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ').trim();

  if (!cleaned || cleaned.length < 20) {
    throw new AppError('Document appears to be empty or unreadable', 422, 'EMPTY_DOCUMENT');
  }

  const truncated = cleaned.length > MAX_CHARS;
  const text = truncated ? cleaned.slice(0, MAX_CHARS) : cleaned;

  return {
    text,
    truncated,
    originalLength: cleaned.length,
    filename: file.originalname,
    fileSizeBytes: file.size,
  };
}
