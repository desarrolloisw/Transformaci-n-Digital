/**
 * Process Service
 *
 * Provides business logic for managing chatbot processes, including retrieval, creation, update, enabling/disabling, and validation. Handles date formatting and transactional updates.
 *
 * Exports:
 *   - getProcesses: Retrieve all processes (with optional search)
 *   - getProcessById: Retrieve a process by ID
 *   - createProcess: Create a new process
 *   - updateProcess: Update an existing process
 *   - disableProcess: Disable a process and its related FAQs
 *   - enableProcess: Enable a process and its related FAQs (if category is active)
 */

import { prisma } from "../../libs/prisma.lib.js";
import { processSchema, processUpdateSchema, processConfirmationSchema } from "../../schemas/chatbot-config/process.schema.js";
import { formatDates } from "../../libs/date.lib.js";

/**
 * Retrieve all processes, optionally filtered by search query.
 * @param {Object} [options] - Optional search parameters.
 * @param {string} [options.search] - Search string to filter processes by name or description.
 * @returns {Promise<Array>} List of processes with formatted dates.
 */
export async function getProcesses({ search } = {}) {
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
    const processes = await prisma.process.findMany({
        where,
        select: { id: true, name: true, description: true, isActive: true, createdAt: true, updatedAt: true },
    });
    return processes.map(formatDates);
}

/**
 * Retrieve a process by its ID.
 * @param {number|string} processId - The process ID.
 * @returns {Promise<Object>} The process object with formatted dates.
 * @throws {Error} If the process is not found (message in Spanish).
 */
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
        return formatDates(process);
    });
}

/**
 * Create a new process. Validates input using Zod schema.
 * @param {Object} data - Process data.
 * @returns {Promise<Object>} The created process, validated and formatted.
 * @throws {Error} If validation fails (message in Spanish).
 */
export async function createProcess(data) {
    const parse = processSchema.safeParse(data);
    if (!parse.success) {
        const error = new Error("Datos inválidos para crear proceso");
        error.validation = parse.error.flatten().fieldErrors;
        throw error;
    }
    const result = await prisma.$transaction(async (tx) => {
        const process = await tx.process.create({
            data: {
                name: parse.data.name,
                description: parse.data.description,
                isActive: parse.data.isActive,
                userId: parse.data.userId,
            },
        });
        return process;
    });
    return processConfirmationSchema.parse(formatDates(result));
}

/**
 * Update an existing process. Validates input and only updates changed fields.
 * @param {number|string} processId - The process ID.
 * @param {Object} data - Updated process data.
 * @returns {Promise<Object>} The updated process, validated and formatted.
 * @throws {Error} If validation fails or process not found (messages in Spanish).
 */
export async function updateProcess(processId, data) {
    const parse = processUpdateSchema.safeParse(data);
    if (!parse.success) {
        const error = new Error("Datos inválidos para actualizar proceso");
        error.validation = parse.error.flatten().fieldErrors;
        throw error;
    }
    return await prisma.$transaction(async (tx) => {
        const current = await tx.process.findUnique({ where: { id: Number(processId) } });
        if (!current) throw new Error("Proceso no encontrado");
        const changes = {};
        if (parse.data.name !== undefined && parse.data.name !== current.name) changes.name = parse.data.name;
        if (parse.data.description !== undefined && parse.data.description !== current.description) changes.description = parse.data.description;
        if (parse.data.isActive !== undefined && parse.data.isActive !== current.isActive) changes.isActive = parse.data.isActive;
        if (Object.keys(changes).length === 0) return processConfirmationSchema.parse({ ...formatDates(current), noChanges: true });
        const updated = await tx.process.update({ where: { id: Number(processId) }, data: changes });
        return processConfirmationSchema.parse(formatDates(updated));
    });
}

/**
 * Disable a process and all its active process-category relationships. Logs the action.
 * @param {number|string} processId - The process ID.
 * @param {number|string} userId - The user performing the action.
 * @returns {Promise<Object>} The disabled process and affected FAQ IDs.
 */
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
        return processConfirmationSchema.parse({ ...formatDates(process), disabledFaqs: faqs.map(f => f.id) });
    });
}

/**
 * Enable a process and all its inactive process-category relationships, only if the category is active. Logs the action.
 * @param {number|string} processId - The process ID.
 * @param {number|string} userId - The user performing the action.
 * @returns {Promise<Object>} The enabled process and affected FAQ IDs.
 */
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
        return processConfirmationSchema.parse({ ...formatDates(process), enabledFaqs });
    });
}