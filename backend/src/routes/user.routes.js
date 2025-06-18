/**
 * User management routes
 *
 * This file defines the API endpoints for user management, including user retrieval, updates, enabling/disabling, and user type queries.
 *
 * Routes:
 *   GET    /user-types           - Get all user types (admin only)
 *   GET    /                    - Get all users (admin only)
 *   GET    /:id                 - Get a user by ID (admin only)
 *   PUT    /:id/complete-name   - Update user's full name (admin only)
 *   PUT    /:id/email           - Update user's email (admin only)
 *   PUT    /:id/username        - Update user's username (admin only)
 *   PUT    /:id/password        - Update user's password (admin only)
 *   PUT    /:id/toggle-enabled  - Enable or disable a user (admin only)
 */

import Router from 'express';
import { getAllUsers, 
    disabledEnabledUserController, 
    getUser,
    updateCompleteNameController, 
    updateEmailController,
    updatePasswordController,
    updateUsernameController,
    getUserTypesController } from '../controllers/user.controller.js';
import { authenticateToken, isPAT } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/user-types', authenticateToken, isPAT, getUserTypesController);
router.get('/', authenticateToken, isPAT, getAllUsers);
router.get('/:id', authenticateToken, isPAT, getUser);
router.put('/:id/complete-name', authenticateToken, isPAT, updateCompleteNameController);
router.put('/:id/email', authenticateToken, isPAT, updateEmailController);
router.put('/:id/username', authenticateToken, isPAT, updateUsernameController);
router.put('/:id/password', authenticateToken, isPAT, updatePasswordController);
router.put('/:id/toggle-enabled', authenticateToken, isPAT, disabledEnabledUserController);

export default router;