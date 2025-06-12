import { Router } from 'express';
import { getAllProcesses, getProcess, createProcessController, updateProcessController, toggleProcessActiveController } from '../../controllers/chatbot-config/process.controller.js';
import { authenticateToken, isAny, isPAT } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authenticateToken, isAny, getAllProcesses);
router.get('/:id', authenticateToken, isPAT, getProcess);
router.post('/', authenticateToken, isPAT, createProcessController);
router.put('/:id', authenticateToken, isPAT, updateProcessController);
router.put('/:id/toggle-active', authenticateToken, isPAT, toggleProcessActiveController);

export default router;
