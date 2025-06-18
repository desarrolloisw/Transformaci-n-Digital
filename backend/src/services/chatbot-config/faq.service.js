/**
 * FAQ Service
 *
 * Provides business logic for managing FAQs (ProcessCategory) in the chatbot configuration, including creation, retrieval, update, and activation/deactivation. Handles validation and date formatting.
 *
 * Exports:
 *   - createFaq: Create a new FAQ for a process and category
 *   - getFaqByProcessAndCategory: Retrieve a FAQ by process and category
 *   - updateFaqResponse: Update the response of a FAQ
 *   - toggleFaqActive: Enable or disable a FAQ
 */

import { prisma } from "../../libs/prisma.lib.js";
import { toHermosillo } from "../../libs/date.lib.js";
import {
  createFaqSchema,
  updateFaqResponseSchema,
  toggleFaqActiveSchema,
  faqConfirmationSchema
} from "../../schemas/chatbot-config/faq.schema.js";

/**
 * Format FAQ date fields to Hermosillo timezone.
 * @param {Object} faq - The FAQ object.
 * @returns {Object} FAQ object with formatted dates.
 */
function formatFaqDates(faq) {
  return {
    ...faq,
    createdAt: toHermosillo(faq.createdAt),
    updatedAt: toHermosillo(faq.updatedAt),
  };
}

/**
 * Create a new FAQ (ProcessCategory).
 * Validates input, checks for existence, and logs the creation action.
 * @param {Object} params - FAQ creation parameters.
 * @param {number|string} params.processId - Process ID.
 * @param {number|string} params.categoryId - Category ID.
 * @param {number|string} params.userId - User ID.
 * @param {string} params.response - FAQ response text.
 * @returns {Promise<Object>} The created FAQ, validated and formatted.
 * @throws {Error} If validation fails or FAQ already exists (messages in Spanish).
 */
export async function createFaq({ processId, categoryId, userId, response }) {
    const parse = createFaqSchema.safeParse({ processId, categoryId, response });
    if (!parse.success) {
        const error = new Error('Datos inválidos para crear FAQ');
        error.validation = parse.error.flatten().fieldErrors;
        throw error;
    }
    if (!userId) throw new Error('userId es requerido');
    if (!processId || !categoryId || !userId || typeof response !== 'string' || !response.trim()) {
        throw new Error('Todos los campos son obligatorios y response debe ser texto.');
    }
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

/**
 * Retrieve a FAQ by process and category IDs.
 * @param {number|string} processId - Process ID.
 * @param {number|string} categoryId - Category ID.
 * @returns {Promise<Object>} The FAQ object, validated and formatted.
 * @throws {Error} If not found (message in Spanish).
 */
export async function getFaqByProcessAndCategory(processId, categoryId) {
    if (!processId || !categoryId) throw new Error('processId y categoryId requeridos');
    const faq = await prisma.processCategory.findUnique({
        where: { processId_categoryId: { processId: Number(processId), categoryId: Number(categoryId) } },
        include: { process: true, category: true }
    });
    if (!faq) throw new Error('FAQ no encontrada');
    return faqConfirmationSchema.parse(formatFaqDates(faq));
}

/**
 * Update the response text of a FAQ.
 * Validates input, checks for changes, and logs the update action.
 * @param {Object} params - FAQ update parameters.
 * @param {number|string} params.processId - Process ID.
 * @param {number|string} params.categoryId - Category ID.
 * @param {number|string} params.userId - User ID.
 * @param {string} params.response - New response text.
 * @returns {Promise<Object>} The updated FAQ, validated and formatted.
 * @throws {Error} If validation fails or FAQ not found (messages in Spanish).
 */
export async function updateFaqResponse({ processId, categoryId, userId, response }) {
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

/**
 * Enable or disable a FAQ (activate/deactivate).
 * Validates input, checks for state, and logs the action.
 * @param {Object} params - Toggle parameters.
 * @param {number|string} params.processId - Process ID.
 * @param {number|string} params.categoryId - Category ID.
 * @param {number|string} params.userId - User ID.
 * @param {boolean} params.isActive - Desired active state.
 * @returns {Promise<Object>} The updated FAQ, validated and formatted.
 * @throws {Error} If validation fails or FAQ not found (messages in Spanish).
 */
export async function toggleFaqActive({ processId, categoryId, userId, isActive }) {
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
            where: { processId_categoryId: { processId: Number(processId), categoryId: Number(categoryId) } },
            include: { process: true, category: true }
        });
        if (!faq) throw new Error('FAQ no encontrada');
        if (faq.isActive === isActive) return faqConfirmationSchema.parse({ ...formatFaqDates(faq), noChanges: true });
        if (isActive) {
            if (!faq.process.isActive) throw new Error('No se puede activar: el proceso está inactivo');
            if (!faq.category.isActive) throw new Error('No se puede activar: la categoría está inactiva');
        }
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