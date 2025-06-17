import { getCategories, getCategoryById, createCategory, updateCategory, disableCategory, enableCategory } from '../../services/chatbot-config/category.service.js';
import { createCategorySchema, updateCategorySchema, categoryConfirmationSchema } from '../../schemas/chatbot-config/category.schema.js';

export async function getAllCategories(req, res) {
  try {
    const { search } = req.query;
    const categories = await getCategories({ search });
    res.status(200).json(categories.map(c => categoryConfirmationSchema.parse(c)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getCategory(req, res) {
  try {
    const category = await getCategoryById(req.params.id);
    res.status(200).json(categoryConfirmationSchema.parse(category));
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

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

export async function deleteCategoryController(req, res) {
  try {
    const deleted = await deleteCategory(req.params.id);
    res.status(200).json(deleted);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

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

// Obtener todas las categorías de un proceso
export async function getCategoriesByProcess(req, res) {
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

// Obtener todas las categorías que NO tiene un proceso
export async function getCategoriesNotInProcess(req, res) {
  try {
    const processId = Number(req.params.processId);
    if (isNaN(processId)) return res.status(400).json({ message: 'processId inválido' });
    // Buscar IDs de categorías ya asociadas al proceso
    const processCategories = await prisma.processCategory.findMany({
      where: { processId },
      select: { categoryId: true }
    });
    const usedCategoryIds = processCategories.map(pc => pc.categoryId);
    // Buscar todas las categorías que NO están en usedCategoryIds
    const categories = await prisma.category.findMany({
      where: { id: { notIn: usedCategoryIds } },
      select: { id: true, name: true, description: true, isActive: true, createdAt: true, updatedAt: true }
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
