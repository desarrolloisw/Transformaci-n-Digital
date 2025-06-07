import { prisma } from "../../libs/prisma.lib.js";
import { toHermosillo } from "../../libs/date.lib.js";
import {
  createFaqSchema,
  updateFaqResponseSchema,
  toggleFaqActiveSchema,
  faqConfirmationSchema
} from "../../schemas/chatbot-config/faq.schema.js";

function formatFaqDates(faq) {
  return {
    ...faq,
    createdAt: toHermosillo(faq.createdAt),
    updatedAt: toHermosillo(faq.updatedAt),
  };
}

// Crear una FAQ (ProcessCategory)
export async function createFaq({ processId, categoryId, userId, response }) {
    // Doble validación
    const parse = createFaqSchema.safeParse({ processId, categoryId, response });
    if (!parse.success) {
        const error = new Error('Datos inválidos para crear FAQ');
        error.validation = parse.error.flatten().fieldErrors;
        throw error;
    }
    if (!userId) throw new Error('userId es requerido');
    // Validaciones básicas
    if (!processId || !categoryId || !userId || typeof response !== 'string' || !response.trim()) {
        throw new Error('Todos los campos son obligatorios y response debe ser texto.');
    }
    // Usar transacción para crear y loguear
    return await prisma.$transaction(async (tx) => {
        const process = await tx.process.findUnique({ where: { id: Number(processId), isActive: true } });
        if (!process) throw new Error('Proceso no encontrado o inactivo');
        const category = await tx.category.findUnique({ where: { id: Number(categoryId), isActive: true } });
        if (!category) throw new Error('Categoría no encontrada o inactiva');
        const exists = await tx.processCategory.findUnique({
            where: { processId_categoryId: { processId: Number(processId), categoryId: Number(categoryId) } }
        });
        if (exists) throw new Error('Ya existe una FAQ para ese proceso y categoría');
        const faq = await tx.processCategory.create({
            data: {
                processId: Number(processId),
                categoryId: Number(categoryId),
                userId: Number(userId),
                response,
                isActive: true
            }
        });
        const actionType = await tx.actionType.findUnique({ where: { name: 'Crear' } });
        await tx.processCategoryLog.create({
            data: {
                processCategoryId: faq.id,
                userId: Number(userId),
                actionTypeId: actionType?.id
            }
        });
        return faqConfirmationSchema.parse(formatFaqDates(faq));
    });
}

// Obtener una FAQ por proceso y categoría
export async function getFaqByProcessAndCategory(processId, categoryId) {
    if (!processId || !categoryId) throw new Error('processId y categoryId requeridos');
    const faq = await prisma.processCategory.findUnique({
        where: { processId_categoryId: { processId: Number(processId), categoryId: Number(categoryId) } },
        include: { process: true, category: true }
    });
    if (!faq) throw new Error('FAQ no encontrada');
    return faqConfirmationSchema.parse(formatFaqDates(faq));
}

// Modificar la respuesta de una FAQ
export async function updateFaqResponse({ processId, categoryId, userId, response }) {
    // Doble validación
    const parse = updateFaqResponseSchema.safeParse({ processId, categoryId, response });
    if (!parse.success) {
        const error = new Error('Datos inválidos para actualizar FAQ');
        error.validation = parse.error.flatten().fieldErrors;
        throw error;
    }
    if (!userId) throw new Error('userId es requerido');
    if (!processId || !categoryId || !userId || typeof response !== 'string' || !response.trim()) {
        throw new Error('Todos los campos son obligatorios y response debe ser texto.');
    }
    return await prisma.$transaction(async (tx) => {
        const faq = await tx.processCategory.findUnique({
            where: { processId_categoryId: { processId: Number(processId), categoryId: Number(categoryId) } }
        });
        if (!faq) throw new Error('FAQ no encontrada');
        if (faq.response === response) return faqConfirmationSchema.parse({ ...formatFaqDates(faq), noChanges: true });
        const updated = await tx.processCategory.update({
            where: { id: faq.id },
            data: { response }
        });
        const actionType = await tx.actionType.findUnique({ where: { name: 'Actualizar' } });
        await tx.processCategoryLog.create({
            data: {
                processCategoryId: faq.id,
                userId: Number(userId),
                actionTypeId: actionType?.id
            }
        });
        return faqConfirmationSchema.parse(formatFaqDates(updated));
    });
}

// Toogle FAQ (activar/desactivar)
export async function toggleFaqActive({ processId, categoryId, userId, isActive }) {
    // Doble validación
    const parse = toggleFaqActiveSchema.safeParse({ processId, categoryId, isActive });
    if (!parse.success) {
        const error = new Error('Datos inválidos para toogle FAQ');
        error.validation = parse.error.flatten().fieldErrors;
        throw error;
    }
    if (!userId) throw new Error('userId es requerido');
    if (!processId || !categoryId || !userId || typeof isActive !== 'boolean') {
        throw new Error('processId, categoryId, userId y isActive (boolean) requeridos');
    }
    return await prisma.$transaction(async (tx) => {
        const faq = await tx.processCategory.findUnique({
            where: { processId_categoryId: { processId: Number(processId), categoryId: Number(categoryId) } }
        });
        if (!faq) throw new Error('FAQ no encontrada');
        if (faq.isActive === isActive) return faqConfirmationSchema.parse({ ...formatFaqDates(faq), noChanges: true });
        const updated = await tx.processCategory.update({
            where: { id: faq.id },
            data: { isActive }
        });
        const actionType = await tx.actionType.findUnique({ where: { name: isActive ? 'Habilitar' : 'Deshabilitar' } });
        await tx.processCategoryLog.create({
            data: {
                processCategoryId: faq.id,
                userId: Number(userId),
                actionTypeId: actionType?.id
            }
        });
        return faqConfirmationSchema.parse(formatFaqDates(updated));
    });
}
