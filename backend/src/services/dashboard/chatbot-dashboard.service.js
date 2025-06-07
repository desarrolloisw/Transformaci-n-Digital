import { prisma } from '../../libs/prisma.lib.js';

// Cache para guardar el id de la acción "Consultar" y evitar consultas repetidas a la base de datos
let consultarActionTypeIdCache = undefined;

// Obtiene el id de la acción "Consultar" desde la base de datos y lo cachea para futuras consultas
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

// Construye el filtro de fechas para las consultas a la base de datos, usando los parámetros 'from' y 'to'
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

// Convierte una fecha/hora local de Hermosillo (YYYY-MM-DDTHH:mm) a UTC para almacenar/consultar en la base de datos
function hermosilloToUTC(dateStr) {
  if (!dateStr) return undefined;
  // Hermosillo está en UTC-7, sin horario de verano
  // Entrada: 'YYYY-MM-DDTHH:mm' o cadena ISO en hora local de Hermosillo
  // Salida: Objeto Date en UTC
  // Se usa aritmética de fechas para evitar problemas con horario de verano
  const [datePart, timePart] = dateStr.split('T');
  if (!datePart || !timePart) return undefined;
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  // Crea la fecha en hora local de Hermosillo y suma 7 horas para obtener UTC
  const hermosilloDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
  // Suma 7 horas para convertir de Hermosillo (UTC-7) a UTC
  hermosilloDate.setUTCHours(hermosilloDate.getUTCHours() + 7);
  return hermosilloDate;
}

// Convierte un rango de fechas de Hermosillo a UTC para usarse en los filtros de la base de datos
function convertRangeToUTC({ from, to }) {
  return {
    from: hermosilloToUTC(from),
    to: hermosilloToUTC(to),
  };
}

// API: Obtiene la fecha del primer log de tipo "Consultar"
// Devuelve la fecha del primer registro donde se realizó la acción "Consultar"
export async function getFirstLogDate() {
  const consultarId = await getConsultarActionTypeId();
  const firstLog = await prisma.processCategoryLog.findFirst({
    where: { actionTypeId: consultarId },
    orderBy: { createdAt: 'asc' },
    select: { createdAt: true },
  });
  return firstLog ? firstLog.createdAt : null;
}

// API: Obtiene la cantidad de preguntas por proceso
// Devuelve un arreglo con todos los procesos y la cantidad de preguntas (consultas) asociadas a cada uno, incluyendo los que tienen cero
export async function getProcessCount({ from, to }) {
  ({ from, to } = convertRangeToUTC({ from, to }));
  const consultarId = await getConsultarActionTypeId();
  // Traer todos los procesos
  const processes = await prisma.process.findMany({
    select: { id: true, name: true },
  });
  // Traer todos los logs agrupados por processCategoryId
  const where = { ...buildDateWhere({ from, to }), actionTypeId: consultarId };
  const logs = await prisma.processCategoryLog.groupBy({
    by: ['processCategoryId'],
    where,
    _count: { _all: true },
  });
  // Traer los processId de cada processCategory
  const processCategories = await prisma.processCategory.findMany({
    where: { id: { in: logs.map(r => r.processCategoryId) } },
    select: { id: true, processId: true },
  });
  const processIdMap = Object.fromEntries(processCategories.map(pc => [pc.id, pc.processId]));
  // Agrupar por processId
  const processCounts = {};
  for (const r of logs) {
    const processId = processIdMap[r.processCategoryId];
    if (!processId) continue;
    if (!processCounts[processId]) processCounts[processId] = 0;
    processCounts[processId] += r._count._all;
  }
  // Armar respuesta: todos los procesos, aunque tengan 0
  return processes.map(proc => ({
    processId: proc.id,
    processName: proc.name,
    count: processCounts[proc.id] || 0,
  }));
}

// API: Obtiene la cantidad de preguntas por categoría
// Devuelve un arreglo con todas las categorías y la cantidad de preguntas (consultas) asociadas a cada una, incluyendo las que tienen cero
export async function getCategoryCount({ from, to }) {
  ({ from, to } = convertRangeToUTC({ from, to }));
  const consultarId = await getConsultarActionTypeId();
  // Traer todas las categorías
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
  });
  // Traer todos los logs agrupados por processCategoryId
  const where = { ...buildDateWhere({ from, to }), actionTypeId: consultarId };
  const logs = await prisma.processCategoryLog.groupBy({
    by: ['processCategoryId'],
    where,
    _count: { _all: true },
  });
  // Traer los categoryId de cada processCategory
  const processCategories = await prisma.processCategory.findMany({
    where: { id: { in: logs.map(r => r.processCategoryId) } },
    select: { id: true, categoryId: true },
  });
  const categoryIdMap = Object.fromEntries(processCategories.map(pc => [pc.id, pc.categoryId]));
  // Agrupar por categoryId
  const categoryCounts = {};
  for (const r of logs) {
    const categoryId = categoryIdMap[r.processCategoryId];
    if (!categoryId) continue;
    if (!categoryCounts[categoryId]) categoryCounts[categoryId] = 0;
    categoryCounts[categoryId] += r._count._all;
  }
  // Armar respuesta: todas las categorías, aunque tengan 0
  return categories.map(cat => ({
    categoryId: cat.id,
    categoryName: cat.name,
    count: categoryCounts[cat.id] || 0,
  }));
}

// API: Obtiene la cantidad de preguntas por categoría de un proceso específico
// Devuelve un arreglo con todas las categorías de un proceso y la cantidad de preguntas asociadas a cada una, incluyendo las que tienen cero
export async function getCategoryCountByProcess({ from, to, processId }) {
  ({ from, to } = convertRangeToUTC({ from, to }));
  const consultarId = await getConsultarActionTypeId();
  // Buscar processCategoryIds de ese proceso y sus categorías
  const processCategories = await prisma.processCategory.findMany({
    where: { processId: Number(processId) },
    select: { id: true, categoryId: true },
  });
  const processCategoryIds = processCategories.map(pc => pc.id);
  const categoryIdMap = Object.fromEntries(processCategories.map(pc => [pc.id, pc.categoryId]));
  // Traer todas las categorías de ese proceso
  const categories = await prisma.category.findMany({
    where: { id: { in: processCategories.map(pc => pc.categoryId) } },
    select: { id: true, name: true },
  });
  // Traer logs agrupados por processCategoryId
  const where = { ...buildDateWhere({ from, to }), actionTypeId: consultarId, processCategoryId: { in: processCategoryIds } };
  const logs = await prisma.processCategoryLog.groupBy({
    by: ['processCategoryId'],
    where,
    _count: { _all: true },
  });
  // Agrupar por categoryId
  const categoryCounts = {};
  for (const r of logs) {
    const categoryId = categoryIdMap[r.processCategoryId];
    if (!categoryId) continue;
    if (!categoryCounts[categoryId]) categoryCounts[categoryId] = 0;
    categoryCounts[categoryId] += r._count._all;
  }
  // Armar respuesta: todas las categorías del proceso, aunque tengan 0
  return categories.map(cat => ({
    categoryId: cat.id,
    categoryName: cat.name,
    count: categoryCounts[cat.id] || 0,
  }));
}

// API: Obtiene el total de preguntas (consultas) realizadas
// Devuelve el número total de preguntas (consultas) realizadas en el rango de fechas especificado
export async function getTotalQuestions({ from, to }) {
  ({ from, to } = convertRangeToUTC({ from, to }));
  const consultarId = await getConsultarActionTypeId();
  const where = { ...buildDateWhere({ from, to }), actionTypeId: consultarId };
  const count = await prisma.processCategoryLog.count({ where });
  return count;
}