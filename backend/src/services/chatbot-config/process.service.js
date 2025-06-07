import { prisma } from "../../libs/prisma.lib.js";
import { toHermosillo } from "../../libs/date.lib.js";
import { processSchema, processUpdateSchema } from "../../schemas/chatbot-config/process.schema.js";
import { z } from "zod";

export const processConfirmationSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    isActive: z.boolean(),
    createdAt: z.any(),
    updatedAt: z.any(),
    disabledFaqs: z.array(z.number()).optional(),
    enabledFaqs: z.array(z.number()).optional(),
    noChanges: z.boolean().optional(),
});

function formatProcessDates(process) {
  return {
    ...process,
    createdAt: toHermosillo(process.createdAt),
    updatedAt: toHermosillo(process.updatedAt),
  };
}

export async function getProcesses({ name } = {}) {
    const where = name ? { name: { contains: name, mode: 'insensitive' } } : {};
    const processes = await prisma.process.findMany({
        where,
        select: { id: true, name: true, isActive: true, createdAt: true, updatedAt: true },
    });
    return processes.map(formatProcessDates);
}

export async function getProcessById(processId) {
    return prisma.process.findUnique({
        where: { id: Number(processId) },
        select: {
            id: true,
            name: true,
            description: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        },
    }).then((process) => {
        if (!process) throw new Error("Proceso no encontrado");
        return formatProcessDates(process);
    });
}

export async function createProcess(data) {
    const parse = processSchema.safeParse(data);
    if (!parse.success) {
        const error = new Error("Datos inválidos para crear proceso");
        error.validation = parse.error.flatten().fieldErrors;
        throw error;
    }
    // Usar transacción para crear proceso
    const result = await prisma.$transaction(async (tx) => {
        const process = await tx.process.create({
            data: {
                name: parse.data.name,
                description: parse.data.description,
                isActive: parse.data.isActive,
            },
        });
        return process;
    });
    return processConfirmationSchema.parse(formatProcessDates(result));
}

export async function updateProcess(processId, data) {
    const parse = processUpdateSchema.safeParse(data);
    if (!parse.success) {
        const error = new Error("Datos inválidos para actualizar proceso");
        error.validation = parse.error.flatten().fieldErrors;
        throw error;
    }
    // Usar transacción para actualizar proceso
    return await prisma.$transaction(async (tx) => {
        const current = await tx.process.findUnique({ where: { id: Number(processId) } });
        if (!current) throw new Error("Proceso no encontrado");
        const changes = {};
        if (parse.data.name !== undefined && parse.data.name !== current.name) changes.name = parse.data.name;
        if (parse.data.description !== undefined && parse.data.description !== current.description) changes.description = parse.data.description;
        if (parse.data.isActive !== undefined && parse.data.isActive !== current.isActive) changes.isActive = parse.data.isActive;
        if (Object.keys(changes).length === 0) return processConfirmationSchema.parse({ ...formatProcessDates(current), noChanges: true });
        const updated = await tx.process.update({ where: { id: Number(processId) }, data: changes });
        return processConfirmationSchema.parse(formatProcessDates(updated));
    });
}

export async function disableProcess(processId, userId) {
    return await prisma.$transaction(async (tx) => {
        const process = await tx.process.update({
            where: { id: Number(processId) },
            data: { isActive: false },
        });
        const faqs = await tx.processCategory.findMany({
            where: { processId: Number(processId), isActive: true },
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
        return processConfirmationSchema.parse({ ...formatProcessDates(process), disabledFaqs: faqs.map(f => f.id) });
    });
}

export async function enableProcess(processId, userId) {
    return await prisma.$transaction(async (tx) => {
        const process = await tx.process.update({
            where: { id: Number(processId) },
            data: { isActive: true },
        });
        const faqs = await tx.processCategory.findMany({
            where: { processId: Number(processId), isActive: false },
            include: { category: true },
        });
        const actionType = await tx.actionType.findUnique({ where: { name: 'Habilitar' } });
        let enabledFaqs = [];
        for (const faq of faqs) {
            if (faq.category.isActive) {
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
        return processConfirmationSchema.parse({ ...formatProcessDates(process), enabledFaqs });
    });
}