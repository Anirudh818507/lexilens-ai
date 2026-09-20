import { Router } from 'express';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { askQuestion } from '../controllers/qaController.js';

const router = Router();

router.post('/', aiLimiter, askQuestion);

export default router;
