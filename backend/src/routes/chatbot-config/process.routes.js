import { Router } from 'express';
import { getAllProcesses, getProcess, createProcessController, updateProcessController, toggleProcessActiveController } from '../../controllers/chatbot-config/process.controller.js';
import { authenticateToken } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getAllProcesses);
router.get('/:id', getProcess);
router.post('/', createProcessController);
router.put('/:id', updateProcessController);
router.put('/:id/toggle-active', authenticateToken, toggleProcessActiveController);

export default router;
