/**
 * Chatbot Dashboard service
 *
 * Provides business logic for analytics and statistics in the chatbot dashboard, including log queries, counts by process/category, and date/time conversion utilities.
 *
 * Exports:
 *   - getFirstLogDate: Get the earliest log date for 'Consultar' action
 *   - getProcessCount: Get the number of questions per process
 *   - getCategoryCount: Get the number of questions per category
 *   - getCategoryCountByProcess: Get the number of questions per category for a specific process
 *   - getTotalQuestions: Get the total number of questions
 *   - getTotalQuestionsByProcess: Get the total number of questions for a specific process
 */

import { prisma } from '../../libs/prisma.lib.js';

let consultarActionTypeIdCache = undefined;

/**
 * Get the id of the 'Consultar' action type, using cache for efficiency.
 * @returns {Promise<number>} The action type id
 * @throws {Error} If the action type does not exist
 */
async function getConsultarActionTypeId() {
  if (consultarActionTypeIdCache !== undefined) return consultarActionTypeIdCache;
  const action = await prisma.actionType.findUnique({
    where: { name: 'Consultar' },
    select: { id: true },
  });
  if (!action) throw new Error('No existe el tipo de acción Consultar');
  consultarActionTypeIdCache = action.id;
  return action.id;
}

/**
 * Build a date filter for database queries using 'from' and 'to' parameters.
 * @param {Object} param0 - Object with from and to fields
 * @returns {Object} Where clause for Prisma
 */
function buildDateWhere({ from, to }) {
  const where = {};
  if (from && to) {
    where.createdAt = { gte: from, lte: to };
  } else if (from) {
    where.createdAt = { gte: from };
  } else if (to) {
    where.createdAt = { lte: to };
  }
  return where;
}

/**
 * Convert a Hermosillo local datetime string (YYYY-MM-DDTHH:mm) to UTC Date object.
 * @param {string} dateStr - Local datetime string
 * @returns {Date|undefined} UTC Date object or undefined
 */
function hermosilloToUTC(dateStr) {
  if (!dateStr) return undefined;
  const [datePart, timePart] = dateStr.split('T');
  if (!datePart || !timePart) return undefined;
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  const hermosilloDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
  hermosilloDate.setUTCHours(hermosilloDate.getUTCHours() + 7);
  return hermosilloDate;
}

/**
 * Convert a date range from Hermosillo local time to UTC.
 * @param {Object} param0 - Object with from and to fields
 * @returns {Object} Object with from and to as UTC Date objects
 */
function convertRangeToUTC({ from, to }) {
  return {
    from: hermosilloToUTC(from),
    to: hermosilloToUTC(to),
  };
}

/**
 * Get the earliest log date for the 'Consultar' action.
 * @returns {Promise<Date|null>} The earliest log date or null
 */
export async function getFirstLogDate() {
  const consultarId = await getConsultarActionTypeId();
  const firstLog = await prisma.processCategoryLog.findFirst({
    where: { actionTypeId: consultarId },
    orderBy: { createdAt: 'asc' },
    select: { createdAt: true },
  });
  return firstLog ? firstLog.createdAt : null;
}

/**
 * Get the number of questions per process.
 * @param {Object} param0 - Object with from and to fields
 * @returns {Promise<Array>} Array of process counts
 */
export async function getProcessCount({ from, to }) {
  ({ from, to } = convertRangeToUTC({ from, to }));
  const consultarId = await getConsultarActionTypeId();
  const processes = await prisma.process.findMany({ select: { id: true, name: true } });
  const where = { ...buildDateWhere({ from, to }), actionTypeId: consultarId };
  const logs = await prisma.processCategoryLog.groupBy({
    by: ['processCategoryId'],
    where,
    _count: { _all: true },
  });
  const processCategories = await prisma.processCategory.findMany({
    where: { id: { in: logs.map(r => r.processCategoryId) } },
    select: { id: true, processId: true },
  });
  const processIdMap = Object.fromEntries(processCategories.map(pc => [pc.id, pc.processId]));
  const processCounts = {};
  for (const r of logs) {
    const processId = processIdMap[r.processCategoryId];
    if (!processId) continue;
    if (!processCounts[processId]) processCounts[processId] = 0;
    processCounts[processId] += r._count._all;
  }
  return processes.map(proc => ({
    processId: proc.id,
    processName: proc.name,
    count: processCounts[proc.id] || 0,
  }));
}

/**
 * Get the number of questions per category.
 * @param {Object} param0 - Object with from and to fields
 * @returns {Promise<Array>} Array of category counts
 */
export async function getCategoryCount({ from, to }) {
  ({ from, to } = convertRangeToUTC({ from, to }));
  const consultarId = await getConsultarActionTypeId();
  const categories = await prisma.category.findMany({ select: { id: true, name: true } });
  const where = { ...buildDateWhere({ from, to }), actionTypeId: consultarId };
  const logs = await prisma.processCategoryLog.groupBy({
    by: ['processCategoryId'],
    where,
    _count: { _all: true },
  });
  const processCategories = await prisma.processCategory.findMany({
    where: { id: { in: logs.map(r => r.processCategoryId) } },
    select: { id: true, categoryId: true },
  });
  const categoryIdMap = Object.fromEntries(processCategories.map(pc => [pc.id, pc.categoryId]));
  const categoryCounts = {};
  for (const r of logs) {
    const categoryId = categoryIdMap[r.processCategoryId];
    if (!categoryId) continue;
    if (!categoryCounts[categoryId]) categoryCounts[categoryId] = 0;
    categoryCounts[categoryId] += r._count._all;
  }
  return categories.map(cat => ({
    categoryId: cat.id,
    categoryName: cat.name,
    count: categoryCounts[cat.id] || 0,
  }));
}

/**
 * Get the number of questions per category for a specific process.
 * @param {Object} param0 - Object with from, to, and processId fields
 * @returns {Promise<Array>} Array of category counts for the process
 */
export async function getCategoryCountByProcess({ from, to, processId }) {
  ({ from, to } = convertRangeToUTC({ from, to }));
  const consultarId = await getConsultarActionTypeId();
  const processCategories = await prisma.processCategory.findMany({
    where: { processId: Number(processId) },
    select: { id: true, categoryId: true },
  });
  const processCategoryIds = processCategories.map(pc => pc.id);
  const categoryIdMap = Object.fromEntries(processCategories.map(pc => [pc.id, pc.categoryId]));
  const categories = await prisma.category.findMany({
    where: { id: { in: processCategories.map(pc => pc.categoryId) } },
    select: { id: true, name: true },
  });
  const where = { ...buildDateWhere({ from, to }), actionTypeId: consultarId, processCategoryId: { in: processCategoryIds } };
  const logs = await prisma.processCategoryLog.groupBy({
    by: ['processCategoryId'],
    where,
    _count: { _all: true },
  });
  const categoryCounts = {};
  for (const r of logs) {
    const categoryId = categoryIdMap[r.processCategoryId];
    if (!categoryId) continue;
    if (!categoryCounts[categoryId]) categoryCounts[categoryId] = 0;
    categoryCounts[categoryId] += r._count._all;
  }
  return categories.map(cat => ({
    categoryId: cat.id,
    categoryName: cat.name,
    count: categoryCounts[cat.id] || 0,
  }));
}

/**
 * Get the total number of questions (consultas) in the specified date range.
 * @param {Object} param0 - Object with from and to fields
 * @returns {Promise<number>} Total number of questions
 */
export async function getTotalQuestions({ from, to }) {
  ({ from, to } = convertRangeToUTC({ from, to }));
  const consultarId = await getConsultarActionTypeId();
  const where = { ...buildDateWhere({ from, to }), actionTypeId: consultarId };
  const count = await prisma.processCategoryLog.count({ where });
  return count;
}

/**
 * Get the total number of questions (consultas) for a specific process in the specified date range.
 * @param {Object} param0 - Object with from, to, and processId fields
 * @returns {Promise<number>} Total number of questions for the process
 */
export async function getTotalQuestionsByProcess({ from, to, processId }) {
  ({ from, to } = convertRangeToUTC({ from, to }));
  const consultarId = await getConsultarActionTypeId();
  const where = { ...buildDateWhere({ from, to }), actionTypeId: consultarId, processCategory: { processId: Number(processId) } };
  const count = await prisma.processCategoryLog.count({ where });
  return count;
}