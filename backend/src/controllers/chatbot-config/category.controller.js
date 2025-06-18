/**
 * Category controller
 *
 * Handles category management requests for the chatbot configuration, including retrieval, creation, update, deletion, activation, and process-based queries. Delegates business logic to the category service layer.
 *
 * Exports:
 *   - getAllCategories: Retrieve all categories (with optional search)
 *   - getCategory: Retrieve a category by ID
 *   - createCategoryController: Create a new category
 *   - updateCategoryController: Update a category by ID
 *   - deleteCategoryController: Delete a category by ID
 *   - toggleCategoryActiveController: Enable or disable a category
 *   - getCategoriesByProcessController: Retrieve categories for a process
 *   - getCategoriesNotInProcessController: Retrieve categories not in a process
 */

import { getCategories, getCategoryById, createCategory, updateCategory, disableCategory, enableCategory, getCategoriesByProcess, getCategoriesNotInProcess } from '../../services/chatbot-config/category.service.js';
import { createCategorySchema, updateCategorySchema, categoryConfirmationSchema } from '../../schemas/chatbot-config/category.schema.js';

/**
 * Retrieve all categories, optionally filtered by search query.
 * @param {Request} req
 * @param {Response} res
 */
export async function getAllCategories(req, res) {
  try {
    const { search } = req.query;
    const categories = await getCategories({ search });
    res.status(200).json(categories.map(c => categoryConfirmationSchema.parse(c)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * Retrieve a category by ID.
 * @param {Request} req
 * @param {Response} res
 */
export async function getCategory(req, res) {
  try {
    const category = await getCategoryById(req.params.id);
    res.status(200).json(categoryConfirmationSchema.parse(category));
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

/**
 * Create a new category.
 * @param {Request} req
 * @param {Response} res
 */
export async function createCategoryController(req, res) {
  try {
    const parse = createCategorySchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        message: "Datos de categoría inválidos",
        errors: parse.error.issues
      });
    }
    const category = await createCategory(parse.data);
    res.status(201).json(categoryConfirmationSchema.parse(category));
  } catch (error) {
    if (error.validation) {
      return res.status(400).json({
        message: "Datos de categoría inválidos",
        errors: Object.entries(error.validation).flatMap(([field, messages]) =>
          messages.map(msg => ({
            code: 'invalid_type',
            path: [field],
            message: msg
          }))
        )
      });
    }
    res.status(400).json({ message: error.message });
  }
}

/**
 * Update a category by ID.
 * @param {Request} req
 * @param {Response} res
 */
export async function updateCategoryController(req, res) {
  try {
    const parse = updateCategorySchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        message: "Datos de categoría inválidos",
        errors: parse.error.issues
      });
    }
    const updated = await updateCategory(req.params.id, parse.data);
    if (updated.noChanges) {
      return res.status(200).json({ ...updated, message: 'No hay cambios para actualizar.' });
    }
    res.status(200).json(categoryConfirmationSchema.parse(updated));
  } catch (error) {
    if (error.validation) {
      return res.status(400).json({
        message: "Datos de categoría inválidos",
        errors: Object.entries(error.validation).flatMap(([field, messages]) =>
          messages.map(msg => ({
            code: 'invalid_type',
            path: [field],
            message: msg
          }))
        )
      });
    }
    res.status(400).json({ message: error.message });
  }
}

/**
 * Delete a category by ID.
 * @param {Request} req
 * @param {Response} res
 */
export async function deleteCategoryController(req, res) {
  try {
    const deleted = await deleteCategory(req.params.id);
    res.status(200).json(deleted);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

/**
 * Enable or disable a category and its FAQs.
 * @param {Request} req
 * @param {Response} res
 */
export async function toggleCategoryActiveController(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Usuario no autenticado' });
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ message: 'El campo isActive (boolean) es requerido.' });
    }
    let result;
    if (isActive) {
      result = await enableCategory(req.params.id, userId);
      res.status(200).json({ message: 'Categoría y FAQs habilitados', ...result });
    } else {
      result = await disableCategory(req.params.id, userId);
      res.status(200).json({ message: 'Categoría y FAQs deshabilitados', ...result });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

/**
 * Retrieve all categories for a process.
 * @param {Request} req
 * @param {Response} res
 */
export async function getCategoriesByProcessController(req, res) {
  try {
    const processId = Number(req.params.processId);
    if (isNaN(processId)) return res.status(400).json({ message: 'processId inválido' });
    const { name } = req.query;
    const categories = await getCategoriesByProcess(processId, { name });
    res.status(200).json(categories.map(c => categoryConfirmationSchema.parse(c)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * Retrieve all categories not in a process.
 * @param {Request} req
 * @param {Response} res
 */
export async function getCategoriesNotInProcessController(req, res) {
  try {
    const processId = Number(req.params.processId);
    if (isNaN(processId)) return res.status(400).json({ message: 'processId inválido' });
    const { name } = req.query;
    const categories = await getCategoriesNotInProcess(processId, { name });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
