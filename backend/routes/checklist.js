import { Router } from 'express';
import { getChecklist } from '../controllers/checklistController.js';

const router = Router();

router.get('/:analysisId', getChecklist);

export default router;
