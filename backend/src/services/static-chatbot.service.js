import { prisma } from '../libs/prisma.lib.js';

export class StaticChatbotService {
  // Devuelve todos los procesos como opciones iniciales (NO loguea)
  static async getInitialOptions() {
    const processes = await prisma.process.findMany({
      select: { id: true, name: true }
    });
    return {
      type: 'options',
      message: 'Selecciona un proceso:',
      options: processes.map(p => ({ id: p.id, label: p.name }))
    };
  }

  // Devuelve las categorías de un proceso y registra en process_log
  static async getCategoriesByProcess(processId) {
    return await prisma.$transaction(async (tx) => {
      const actionType = await tx.actionType.findUnique({ where: { name: 'Consultar' } });
      if (!actionType) throw new Error('Tipo de acción "Consultar" no encontrado');
      // Loguea la selección del proceso
      await tx.processLog.create({
        data: {
          processId: Number(processId),
          userId: null,
          actionTypeId: actionType.id
        }
      });
      const categories = await tx.processCategory.findMany({
        where: { processId: Number(processId) },
        select: { id: true, category: { select: { name: true } } }
      });
      return {
        type: 'options',
        message: 'Selecciona una categoría:',
        options: categories.map(c => ({ id: c.id, label: c.category.name }))
      };
    });
  }

  // Devuelve la respuesta de una categoría y registra en ProcessCategoryLog (faq_log)
  static async getResponseByCategory(processCategoryId) {
    return await prisma.$transaction(async (tx) => {
      const actionType = await tx.actionType.findUnique({ where: { name: 'Consultar' } });
      if (!actionType) throw new Error('Tipo de acción "Consultar" no encontrado');
      const processCategory = await tx.processCategory.findUnique({
        where: { id: Number(processCategoryId) },
        select: { response: true, category: { select: { name: true } } }
      });
      if (!processCategory) throw new Error('Categoría no encontrada');
      // Loguea la consulta a la relación proceso-categoría (faq_log)
      await tx.processCategoryLog.create({
        data: {
          processCategoryId: Number(processCategoryId),
          userId: null,
          actionTypeId: actionType.id
        }
      });
      return {
        type: 'response',
        message: processCategory.response,
        category: processCategory.category.name
      };
    });
  }
}

