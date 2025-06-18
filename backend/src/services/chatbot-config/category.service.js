/**
 * Category Service
 *
 * Provides business logic for managing chatbot categories, including retrieval, creation, update, enabling/disabling, and process-category relationships. Handles validation and date formatting.
 *
 * Exports:
 *   - getCategories: Retrieve all categories (with optional search)
 *   - getCategoriesByProcess: Retrieve all categories for a process (with optional name filter)
 *   - getCategoriesNotInProcess: Retrieve all categories not associated with a process
 *   - getCategoryById: Retrieve a category by ID
 *   - createCategory: Create a new category
 *   - updateCategory: Update an existing category
 *   - disableCategory: Disable a category and its related FAQs
 *   - enableCategory: Enable a category and its related FAQs (if process is active)
 */

import { prisma } from "../../libs/prisma.lib.js";
import { createCategorySchema, updateCategorySchema, categoryConfirmationSchema } from "../../schemas/chatbot-config/category.schema.js";
import { formatDates } from "../../libs/date.lib.js";

/**
 * Retrieve all categories, optionally filtered by search query.
 * @param {Object} [options] - Optional search parameters.
 * @param {string} [options.search] - Search string to filter categories by name or description.
 * @returns {Promise<Array>} List of categories with formatted dates.
 */
export async function getCategories({ search } = {}) {
    let where = {};
    if (search && search.trim() !== "") {
        const words = search.trim().split(/\s+/);
        where = {
            AND: words.map(word => ({
                OR: [
                    { name: { contains: word } },
                    { description: { contains: word } }
                ]
            }))
        };
    }
    return prisma.category.findMany({
        where,
        select: { id: true, name: true, description: true, isActive: true, createdAt: true, updatedAt: true },
    }).then(categories => categories.map(formatDates));
}

/**
 * Retrieve all categories associated with a process, with optional name filtering.
 * Returns the active/inactive state of the process-category relationship.
 * @param {number|string} processId - The process ID.
 * @param {Object} [options] - Optional filter parameters.
 * @param {string} [options.name] - Name filter for categories.
 * @returns {Promise<Array>} List of categories with isActive state.
 */
export async function getCategoriesByProcess(processId, { name } = {}) {
    const where = { processId: Number(processId) };
    const processCategories = await prisma.processCategory.findMany({
        where,
        select: { category: { select: { id: true, name: true, description: true } }, isActive: true },
    });
    const filtered = name
      ? processCategories.filter(pc => pc.category.name.toLowerCase().includes(name.toLowerCase()))
      : processCategories;
    return filtered.map(pc => ({ ...pc.category, isActive: pc.isActive }));
}

/**
 * Retrieve all categories that are not associated with a given process.
 * @param {number|string} processId - The process ID.
 * @param {Object} [options] - Optional filter parameters.
 * @param {string} [options.name] - Name filter for categories.
 * @returns {Promise<Array>} List of categories not in the process.
 */
export async function getCategoriesNotInProcess(processId, { name } = {}) {
    const where = { isActive: true };
    if (name && name.trim() !== "") {
        where.name = { contains: name, mode: 'insensitive' };
    }
    const categories = await prisma.category.findMany({
        where,
        select: { id: true, name: true },
    });
    const processCategories = await prisma.processCategory.findMany({
        where: { processId: Number(processId) },
        select: { categoryId: true }
    });
    const excludedCategoryIds = new Set(processCategories.map(pc => pc.categoryId));
    return categories.filter(cat => !excludedCategoryIds.has(cat.id));
}

/**
 * Retrieve a single category by its ID.
 * @param {number|string} categoryId - The category ID.
 * @returns {Promise<Object>} The category object with formatted dates.
 * @throws {Error} If the category is not found (message in Spanish).
 */
export async function getCategoryById(categoryId) {
    const cat = await prisma.category.findUnique({
        where: { id: Number(categoryId) },
        select: { id: true, name: true, description: true, isActive: true, createdAt: true, updatedAt: true },
    });
    if (!cat) throw new Error("Categoría no encontrada");
    return formatDates(cat);
}

/**
 * Create a new category. Validates input using Zod schema.
 * @param {Object} data - Category data.
 * @returns {Promise<Object>} The created category, validated and formatted.
 * @throws {Error} If validation fails (message in Spanish).
 */
export async function createCategory(data) {
    const parse = createCategorySchema.safeParse(data);
    if (!parse.success) {
        const error = new Error("Datos inválidos para crear categoría");
        error.validation = parse.error.flatten().fieldErrors;
        throw error;
    }
    const result = await prisma.$transaction(async (tx) => {
        const category = await tx.category.create({
            data: {
                name: parse.data.name,
                description: parse.data.description,
                isActive: parse.data.isActive !== undefined ? parse.data.isActive : true,
                userId: parse.data.userId,
            },
        });
        return category;
    });
    return categoryConfirmationSchema.parse(formatDates(result));
}

/**
 * Update an existing category. Validates input and only updates changed fields.
 * @param {number|string} categoryId - The category ID.
 * @param {Object} data - Updated category data.
 * @returns {Promise<Object>} The updated category, validated and formatted.
 * @throws {Error} If validation fails or category not found (messages in Spanish).
 */
export async function updateCategory(categoryId, data) {
    const parse = updateCategorySchema.safeParse(data);
    if (!parse.success) {
        const error = new Error("Datos inválidos para actualizar categoría");
        error.validation = parse.error.flatten().fieldErrors;
        throw error;
    }
    return await prisma.$transaction(async (tx) => {
        const current = await tx.category.findUnique({ where: { id: Number(categoryId) } });
        if (!current) throw new Error("Categoría no encontrada");
        const changes = {};
        if (parse.data.name !== undefined && parse.data.name !== current.name) changes.name = parse.data.name;
        if (parse.data.description !== undefined && parse.data.description !== current.description) changes.description = parse.data.description;
        if (parse.data.isActive !== undefined && parse.data.isActive !== current.isActive) changes.isActive = parse.data.isActive;
        if (Object.keys(changes).length === 0) return categoryConfirmationSchema.parse({ ...formatDates(current), noChanges: true });
        const updated = await tx.category.update({ where: { id: Number(categoryId) }, data: changes });
        return categoryConfirmationSchema.parse(formatDates(updated));
    });
}

/**
 * Disable a category and all its active process-category relationships. Logs the action.
 * @param {number|string} categoryId - The category ID.
 * @param {number|string} userId - The user performing the action.
 * @returns {Promise<Object>} The disabled category and affected FAQ IDs.
 */
export async function disableCategory(categoryId, userId) {
    return await prisma.$transaction(async (tx) => {
        const category = await tx.category.update({
            where: { id: Number(categoryId) },
            data: { isActive: false },
        });
        const faqs = await tx.processCategory.findMany({
            where: { categoryId: Number(categoryId), isActive: true },
        });
        const actionType = await tx.actionType.findUnique({ where: { name: 'Deshabilitar' } });
        for (const faq of faqs) {
            await tx.processCategory.update({ where: { id: faq.id }, data: { isActive: false } });
            await tx.processCategoryLog.create({
                data: {
                    processCategoryId: faq.id,
                    userId: userId,
                    actionTypeId: actionType?.id,
                },
            });
        }
        return categoryConfirmationSchema.parse({ ...formatDates(category), disabledFaqs: faqs.map(f => f.id) });
    });
}

/**
 * Enable a category and all its inactive process-category relationships, only if the process is active. Logs the action.
 * @param {number|string} categoryId - The category ID.
 * @param {number|string} userId - The user performing the action.
 * @returns {Promise<Object>} The enabled category and affected FAQ IDs.
 */
export async function enableCategory(categoryId, userId) {
    return await prisma.$transaction(async (tx) => {
        const category = await tx.category.update({
            where: { id: Number(categoryId) },
            data: { isActive: true },
        });
        const faqs = await tx.processCategory.findMany({
            where: { categoryId: Number(categoryId), isActive: false },
            include: { process: true },
        });
        const actionType = await tx.actionType.findUnique({ where: { name: 'Habilitar' } });
        let enabledFaqs = [];
        for (const faq of faqs) {
            if (faq.process.isActive) {
                await tx.processCategory.update({ where: { id: faq.id }, data: { isActive: true } });
                enabledFaqs.push(faq.id);
                await tx.processCategoryLog.create({
                    data: {
                        processCategoryId: faq.id,
                        userId: userId,
                        actionTypeId: actionType?.id,
                    },
                });
            }
        }
        return categoryConfirmationSchema.parse({ ...formatDates(category), enabledFaqs });
    });
}