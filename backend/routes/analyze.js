import { Router } from 'express';
import { upload, handleMulterError } from '../middleware/upload.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { analyzeUpload, analyzeSample, getAnalysisById } from '../controllers/analyzeController.js';

const router = Router();

router.post('/upload', aiLimiter, upload.single('document'), handleMulterError, analyzeUpload);
router.post('/sample', aiLimiter, analyzeSample);
router.get('/:id', getAnalysisById);

export default router;
