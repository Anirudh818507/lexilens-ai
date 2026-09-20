import { getAnalysis } from '../services/analysisStore.js';
import { generateChecklist, generateLawyerQuestions } from '../services/ai/generateChecklist.js';
import { AppError } from '../middleware/errorHandler.js';

export async function getChecklist(req, res, next) {
  try {
    const entry = getAnalysis(req.params.analysisId);
    if (!entry) {
      throw new AppError('Analysis not found or expired. Please re-analyze the document.', 404, 'NOT_FOUND');
    }
    res.json({
      checklist: generateChecklist(entry.analysis),
      lawyerQuestions: generateLawyerQuestions(entry.analysis),
    });
  } catch (err) {
    next(err);
  }
}
