import { Router } from 'express';
import { upload, handleMulterError } from '../middleware/upload.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { compareUploads } from '../controllers/compareController.js';

const router = Router();

router.post(
  '/',
  aiLimiter,
  upload.fields([
    { name: 'documentA', maxCount: 1 },
    { name: 'documentB', maxCount: 1 },
  ]),
  handleMulterError,
  compareUploads
);

export default router;
