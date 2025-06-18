/**
 * Process management routes
 *
 * This file defines the API endpoints for managing chatbot processes, including CRUD operations and toggling active state.
 *
 * Routes:
 *   GET    /                - Get all processes (admin or any authorized user)
 *   GET    /:id             - Get a process by ID (admin only)
 *   POST   /                - Create a new process (admin only)
 *   PUT    /:id             - Update a process by ID (admin only)
 *   PUT    /:id/toggle-active - Toggle active state of a process (admin only)
 */

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
