import { extractText } from '../services/documentExtractor.js';
import { compareDocuments } from '../services/ai/compareDocuments.js';
import { AppError } from '../middleware/errorHandler.js';

export async function compareUploads(req, res, next) {
  try {
    const fileA = req.files?.documentA?.[0];
    const fileB = req.files?.documentB?.[0];

    if (!fileA || !fileB) {
      throw new AppError('Both documentA and documentB are required', 400, 'VALIDATION_ERROR');
    }

    const [extractedA, extractedB] = await Promise.all([extractText(fileA), extractText(fileB)]);

    const result = await compareDocuments(
      extractedA.text,
      extractedB.text,
      extractedA.filename,
      extractedB.filename
    );

    res.json({
      documentA: { filename: extractedA.filename },
      documentB: { filename: extractedB.filename },
      ...result,
    });
  } catch (err) {
    next(err);
  }
}
