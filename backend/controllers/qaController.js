import { getAnalysis } from '../services/analysisStore.js';
import { answerDocumentQuestion } from '../services/ai/answerDocumentQuestion.js';
import { AppError } from '../middleware/errorHandler.js';

export async function askQuestion(req, res, next) {
  try {
    const { analysisId, question } = req.body || {};

    if (!analysisId || typeof analysisId !== 'string') {
      throw new AppError('analysisId is required', 400, 'VALIDATION_ERROR');
    }
    if (!question || typeof question !== 'string' || !question.trim()) {
      throw new AppError('Question cannot be empty', 400, 'VALIDATION_ERROR');
    }

    const entry = getAnalysis(analysisId);
    if (!entry) {
      throw new AppError('Analysis not found or expired. Please re-analyze the document.', 404, 'NOT_FOUND');
    }

    const result = await answerDocumentQuestion(entry.documentText, question.trim());
    res.json(result);
  } catch (err) {
    next(err);
  }
}
