/**
 * FAQ controller
 *
 * Handles FAQ management requests for the chatbot configuration, including creation, retrieval, response update, and active state toggling. Delegates business logic to the FAQ service layer.
 *
 * Exports:
 *   - createFaqController: Create a new FAQ
 *   - getFaqByProcessAndCategoryController: Retrieve FAQ by process and category
 *   - updateFaqResponseController: Update FAQ response
 *   - toggleFaqActiveController: Enable or disable a FAQ
 */

import {
  createFaq,
  getFaqByProcessAndCategory,
  updateFaqResponse,
  toggleFaqActive
} from '../../services/chatbot-config/faq.service.js';
import {
  createFaqSchema,
  updateFaqResponseSchema,
  toggleFaqActiveSchema,
  faqConfirmationSchema
} from '../../schemas/chatbot-config/faq.schema.js';

/**
 * Create a new FAQ.
 * @param {Request} req
 * @param {Response} res
 */
export async function createFaqController(req, res) {
  try {
    const parse = createFaqSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        message: "Datos de FAQ inválidos",
        errors: parse.error.issues
      });
    }
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Usuario no autenticado' });
    const faq = await createFaq({ ...parse.data, userId });
    const confirmed = faqConfirmationSchema.safeParse(faq);
    if (!confirmed.success) {
      return res.status(500).json({ message: 'Error de confirmación de FAQ', errors: confirmed.error.issues });
    }
    res.status(201).json(confirmed.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

/**
 * Retrieve FAQ by process and category.
 * @param {Request} req
 * @param {Response} res
 */
export async function getFaqByProcessAndCategoryController(req, res) {
  try {
    const processId = Number(req.query.processId);
    const categoryId = Number(req.query.categoryId);
    if (isNaN(processId) || isNaN(categoryId)) {
      return res.status(400).json({ message: 'processId y categoryId deben ser números' });
    }
    const faq = await getFaqByProcessAndCategory(processId, categoryId);
    const confirmed = faqConfirmationSchema.safeParse(faq);
    if (!confirmed.success) {
      return res.status(500).json({ message: 'Error de confirmación de FAQ', errors: confirmed.error.issues });
    }
    res.status(200).json(confirmed.data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

/**
 * Update FAQ response.
 * @param {Request} req
 * @param {Response} res
 */
export async function updateFaqResponseController(req, res) {
  try {
    const parse = updateFaqResponseSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        message: "Datos de FAQ inválidos",
        errors: parse.error.issues
      });
    }
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Usuario no autenticado' });
    const updated = await updateFaqResponse({ ...parse.data, userId });
    const confirmed = faqConfirmationSchema.safeParse(updated);
    if (!confirmed.success) {
      return res.status(500).json({ message: 'Error de confirmación de FAQ', errors: confirmed.error.issues });
    }
    if (confirmed.data.noChanges) {
      return res.status(200).json({ ...confirmed.data, message: 'No hay cambios para actualizar.' });
    }
    res.status(200).json(confirmed.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

/**
 * Enable or disable a FAQ.
 * @param {Request} req
 * @param {Response} res
 */
export async function toggleFaqActiveController(req, res) {
  try {
    const parse = toggleFaqActiveSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        message: "Datos de FAQ inválidos",
        errors: parse.error.issues
      });
    }
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Usuario no autenticado' });
    const updated = await toggleFaqActive({ ...parse.data, userId });
    const confirmed = faqConfirmationSchema.safeParse(updated);
    if (!confirmed.success) {
      return res.status(500).json({ message: 'Error de confirmación de FAQ', errors: confirmed.error.issues });
    }
    if (confirmed.data.noChanges) {
      return res.status(200).json({ ...confirmed.data, message: 'No hay cambios para actualizar.' });
    }
    res.status(200).json(confirmed.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
