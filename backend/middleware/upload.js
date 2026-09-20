import multer from 'multer';
import path from 'path';
import { AppError } from './errorHandler.js';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'text/plain',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
]);

const ALLOWED_EXTENSIONS = new Set(['.pdf', '.txt', '.docx']);

// Use memory storage: we never persist raw uploads to disk long-term.
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_MIME_TYPES.has(file.mimetype) || !ALLOWED_EXTENSIONS.has(ext)) {
    return cb(new AppError('Unsupported file type', 400, 'UNSUPPORTED_FILE_TYPE'));
  }
  cb(null, true);
}

export const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE, files: 2 },
  fileFilter,
});

export function handleMulterError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(new AppError('File too large', 400, 'FILE_TOO_LARGE'));
    }
    return next(new AppError('Upload error', 400, 'VALIDATION_ERROR'));
  }
  next(err);
  
}
