import { prisma } from '../../libs/prisma.lib.js';

let consultarActionTypeIdCache = undefined;

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

// Fecha del primer log de tipo Consultar
export async function getFirstLogDate() {
  const consultarId = await getConsultarActionTypeId();
  const firstLog = await prisma.processCategoryLog.findFirst({
    where: { actionTypeId: consultarId },
    orderBy: { createdAt: 'asc' },
    select: { createdAt: true },
  });
  return firstLog ? firstLog.createdAt : null;
}

// Cantidad de preguntas por proceso
export async function getProcessCount({ from, to }) {
  const consultarId = await getConsultarActionTypeId();
  const where = { ...buildDateWhere({ from, to }), actionTypeId: consultarId };
  const result = await prisma.processCategoryLog.groupBy({
    by: ['processCategoryId'],
    where,
    _count: { _all: true },
  });
  // Traer los processId de cada processCategory
  const processCategories = await prisma.processCategory.findMany({
    where: { id: { in: result.map(r => r.processCategoryId) } },
    select: { id: true, processId: true },
  });
  const processIdMap = Object.fromEntries(processCategories.map(pc => [pc.id, pc.processId]));
  // Agrupar por processId
  const processCounts = {};
  for (const r of result) {
    const processId = processIdMap[r.processCategoryId];
    if (!processId) continue;
    if (!processCounts[processId]) processCounts[processId] = 0;
    processCounts[processId] += r._count._all;
  }
  // Traer nombres de procesos
  const processes = await prisma.process.findMany({
    where: { id: { in: Object.keys(processCounts).map(Number) } },
    select: { id: true, name: true },
  });
  const processMap = Object.fromEntries(processes.map(p => [p.id, p.name]));
  return Object.entries(processCounts).map(([processId, count]) => ({
    processId: Number(processId),
    processName: processMap[Number(processId)] || '',
    count,
  }));
}

// Cantidad de preguntas por categoría
export async function getCategoryCount({ from, to }) {
  const consultarId = await getConsultarActionTypeId();
  const where = { ...buildDateWhere({ from, to }), actionTypeId: consultarId };
  const result = await prisma.processCategoryLog.groupBy({
    by: ['processCategoryId'],
    where,
    _count: { _all: true },
  });
  // Traer los categoryId de cada processCategory
  const processCategories = await prisma.processCategory.findMany({
    where: { id: { in: result.map(r => r.processCategoryId) } },
    select: { id: true, categoryId: true },
  });
  const categoryIdMap = Object.fromEntries(processCategories.map(pc => [pc.id, pc.categoryId]));
  // Agrupar por categoryId
  const categoryCounts = {};
  for (const r of result) {
    const categoryId = categoryIdMap[r.processCategoryId];
    if (!categoryId) continue;
    if (!categoryCounts[categoryId]) categoryCounts[categoryId] = 0;
    categoryCounts[categoryId] += r._count._all;
  }
  // Traer nombres de categorías
  const categories = await prisma.category.findMany({
    where: { id: { in: Object.keys(categoryCounts).map(Number) } },
    select: { id: true, name: true },
  });
  const categoryMap = Object.fromEntries(categories.map(c => [c.id, c.name]));
  return Object.entries(categoryCounts).map(([categoryId, count]) => ({
    categoryId: Number(categoryId),
    categoryName: categoryMap[Number(categoryId)] || '',
    count,
  }));
}

// Cantidad de preguntas por categoría de un proceso
export async function getCategoryCountByProcess({ from, to, processId }) {
  const consultarId = await getConsultarActionTypeId();
  // Buscar processCategoryIds de ese proceso
  const processCategories = await prisma.processCategory.findMany({
    where: { processId: Number(processId) },
    select: { id: true, categoryId: true },
  });
  const processCategoryIds = processCategories.map(pc => pc.id);
  const categoryIdMap = Object.fromEntries(processCategories.map(pc => [pc.id, pc.categoryId]));
  const where = { ...buildDateWhere({ from, to }), actionTypeId: consultarId, processCategoryId: { in: processCategoryIds } };
  const result = await prisma.processCategoryLog.groupBy({
    by: ['processCategoryId'],
    where,
    _count: { _all: true },
  });
  // Agrupar por categoryId
  const categoryCounts = {};
  for (const r of result) {
    const categoryId = categoryIdMap[r.processCategoryId];
    if (!categoryId) continue;
    if (!categoryCounts[categoryId]) categoryCounts[categoryId] = 0;
    categoryCounts[categoryId] += r._count._all;
  }
  // Traer nombres de categorías
  const categories = await prisma.category.findMany({
    where: { id: { in: Object.keys(categoryCounts).map(Number) } },
    select: { id: true, name: true },
  });
  const categoryMap = Object.fromEntries(categories.map(c => [c.id, c.name]));
  return Object.entries(categoryCounts).map(([categoryId, count]) => ({
    categoryId: Number(categoryId),
    categoryName: categoryMap[Number(categoryId)] || '',
    count,
  }));
}

// Total de preguntas
export async function getTotalQuestions({ from, to }) {
  const consultarId = await getConsultarActionTypeId();
  const where = { ...buildDateWhere({ from, to }), actionTypeId: consultarId };
  const count = await prisma.processCategoryLog.count({ where });
  return count;
}