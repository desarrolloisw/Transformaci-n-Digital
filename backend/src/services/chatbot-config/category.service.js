import { prisma } from "../../libs/prisma.lib.js";
import { toHermosillo } from "../../libs/date.lib.js";
import { createCategorySchema, updateCategorySchema } from "../../schemas/chatbot-config/category.schema.js";
import { z } from "zod";

export const categoryConfirmationSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    isActive: z.boolean(),
    createdAt: z.any(),
    updatedAt: z.any(),
    disabledFaqs: z.array(z.number()).optional(),
    enabledFaqs: z.array(z.number()).optional(),
    alreadyInactive: z.boolean().optional(),
    noChanges: z.boolean().optional(),
});

function formatCategoryDates(cat) {
  return {
    ...cat,
    createdAt: toHermosillo(cat.createdAt),
    updatedAt: toHermosillo(cat.updatedAt),
  };
}

export async function getCategories({ name } = {}) {
    const where = name ? { name: { contains: name, mode: 'insensitive' } } : {};
    return prisma.category.findMany({
        where,
        select: { id: true, name: true, description: true, isActive: true, createdAt: true, updatedAt: true },
    }).then(categories => categories.map(formatCategoryDates));
}

// Obtener todas las categorías de un proceso, con búsqueda opcional por nombre
export async function getCategoriesByProcess(processId, { name } = {}) {
    const where = { processId: Number(processId) };
    const categoryWhere = name ? { name: { contains: name, mode: 'insensitive' } } : {};
    const processCategories = await prisma.processCategory.findMany({
        where,
        select: { category: true }
    });
    // Filter by name if provided
    const filtered = name
      ? processCategories.filter(pc => pc.category.name.toLowerCase().includes(name.toLowerCase()))
      : processCategories;
    return filtered.map(pc => formatCategoryDates(pc.category));
}

export async function getCategoryById(categoryId) {
    const cat = await prisma.category.findUnique({
        where: { id: Number(categoryId) },
        select: { id: true, name: true, description: true, isActive: true, createdAt: true, updatedAt: true },
    });
    if (!cat) throw new Error("Categoría no encontrada");
    return formatCategoryDates(cat);
}

export async function createCategory(data) {
    const parse = createCategorySchema.safeParse(data);
    if (!parse.success) {
        const error = new Error("Datos inválidos para crear categoría");
        error.validation = parse.error.flatten().fieldErrors;
        throw error;
    }
    // Usar transacción para crear categoría
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
    return categoryConfirmationSchema.parse(formatCategoryDates(result));
}

export async function updateCategory(categoryId, data) {
    const parse = updateCategorySchema.safeParse(data);
    if (!parse.success) {
        const error = new Error("Datos inválidos para actualizar categoría");
        error.validation = parse.error.flatten().fieldErrors;
        throw error;
    }
    // Usar transacción para actualizar categoría
    return await prisma.$transaction(async (tx) => {
        const current = await tx.category.findUnique({ where: { id: Number(categoryId) } });
        if (!current) throw new Error("Categoría no encontrada");
        const changes = {};
        if (parse.data.name !== undefined && parse.data.name !== current.name) changes.name = parse.data.name;
        if (parse.data.description !== undefined && parse.data.description !== current.description) changes.description = parse.data.description;
        if (parse.data.isActive !== undefined && parse.data.isActive !== current.isActive) changes.isActive = parse.data.isActive;
        if (Object.keys(changes).length === 0) return categoryConfirmationSchema.parse({ ...formatCategoryDates(current), noChanges: true });
        const updated = await tx.category.update({ where: { id: Number(categoryId) }, data: changes });
        return categoryConfirmationSchema.parse(formatCategoryDates(updated));
    });
}

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
        return categoryConfirmationSchema.parse({ ...formatCategoryDates(category), disabledFaqs: faqs.map(f => f.id) });
    });
}

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
        return categoryConfirmationSchema.parse({ ...formatCategoryDates(category), enabledFaqs });
    });
}
