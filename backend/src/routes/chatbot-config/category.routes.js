import { Router } from 'express';
import { getAllCategories, getCategory, createCategoryController, updateCategoryController, deleteCategoryController, toggleCategoryActiveController, getCategoriesByProcess, getCategoriesNotInProcess } from '../../controllers/chatbot-config/category.controller.js';
import { authenticateToken, isPAT } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getAllCategories);
router.get('/:id', getCategory);
router.post('/', createCategoryController);
router.put('/:id', updateCategoryController);
router.delete('/:id', deleteCategoryController);
router.put('/:id/toggle-active', toggleCategoryActiveController);
router.get('/by-process/:processId', getCategoriesByProcess);
router.get('/not-in-process/:processId', getCategoriesNotInProcess);

export default router;
