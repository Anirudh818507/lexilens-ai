import { randomUUID } from 'crypto';
import { extractText } from '../services/documentExtractor.js';
import { analyzeDocument } from '../services/ai/analyzeDocument.js';
import { saveAnalysis, getAnalysis } from '../services/analysisStore.js';
import { AppError } from '../middleware/errorHandler.js';
import { SAMPLE_CONTRACT } from '../utils/sampleContract.js';

export async function analyzeUpload(req, res, next) {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded', 400, 'VALIDATION_ERROR');
    }

    const extracted = await extractText(req.file);
    const analysis = await analyzeDocument(extracted.text, extracted.filename);

    const analysisId = randomUUID();
    saveAnalysis(analysisId, {
      documentText: extracted.text,
      filename: extracted.filename,
      analysis,
    });

    // Note: req.file.buffer is in-memory only and is discarded automatically
    // once this request completes — nothing is ever written to disk.

    res.json({ analysisId, ...analysis });
  } catch (err) {
    next(err);
  }
}

export async function analyzeSample(req, res, next) {
  try {
    const analysis = await analyzeDocument(SAMPLE_CONTRACT.text, SAMPLE_CONTRACT.filename);
    const analysisId = randomUUID();
    saveAnalysis(analysisId, {
      documentText: SAMPLE_CONTRACT.text,
      filename: SAMPLE_CONTRACT.filename,
      analysis,
    });
    res.json({ analysisId, ...analysis });
  } catch (err) {
    next(err);
  }
}

export async function getAnalysisById(req, res, next) {
  try {
    const entry = getAnalysis(req.params.id);
    if (!entry) {
      throw new AppError('Analysis not found or expired', 404, 'NOT_FOUND');
    }
    res.json({ analysisId: req.params.id, ...entry.analysis });
  } catch (err) {
    next(err);
  }
}
