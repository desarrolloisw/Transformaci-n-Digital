import { Router } from 'express';
import { getAllCategories, getCategory, createCategoryController, updateCategoryController, deleteCategoryController, toggleCategoryActiveController, getCategoriesByProcessController, getCategoriesNotInProcessController } from '../../controllers/chatbot-config/category.controller.js';
import { authenticateToken, isPAT } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authenticateToken, isPAT, getAllCategories);
router.get('/:id', authenticateToken, isPAT, getCategory);
router.post('/', authenticateToken, isPAT, createCategoryController);
router.put('/:id', authenticateToken, isPAT, updateCategoryController);
router.delete('/:id', authenticateToken, isPAT, deleteCategoryController);
router.put('/:id/toggle-active', authenticateToken, isPAT, toggleCategoryActiveController);
router.get('/by-process/:processId', authenticateToken, isPAT, getCategoriesByProcessController);
router.get('/not-in-process/:processId', authenticateToken, isPAT, getCategoriesNotInProcessController);

export default router;
