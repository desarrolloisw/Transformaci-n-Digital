import { prisma } from '../libs/prisma.lib.js';

export class StaticChatbotService {
  // Devuelve todos los procesos como opciones iniciales (NO loguea)
  static async getInitialOptions() {
    const processes = await prisma.process.findMany({
      where: { isActive: true },
      select: { id: true, name: true }
    });
    return {
      type: 'options',
      message: 'Selecciona un proceso:',
      options: processes.map(p => ({ id: p.id, label: p.name }))
    };
  }

  // Devuelve las categorías de un proceso (NO loguea)
  static async getCategoriesByProcess(processId) {
    const categories = await prisma.processCategory.findMany({
      where: { processId: Number(processId), isActive: true },
      select: { id: true, category: { select: { name: true, isActive: true } } }
    });
    // Solo mostrar categorías activas (por si la relación está activa pero la categoría no)
    return {
      type: 'options',
      message: 'Selecciona una categoría:',
      options: categories
        .filter(c => c.category.isActive)
        .map(c => ({ id: c.id, label: c.category.name }))
    };
  }

  // Devuelve la respuesta de una categoría y registra en ProcessCategoryLog (faq_log)
  static async getResponseByCategory(processCategoryId) {
    return await prisma.$transaction(async (tx) => {
      const actionType = await tx.actionType.findUnique({ where: { name: 'Consultar' } });
      if (!actionType) throw new Error('Tipo de acción "Consultar" no encontrado');
      const processCategory = await tx.processCategory.findUnique({
        where: { id: Number(processCategoryId), isActive: true },
        select: { response: true, category: { select: { name: true, isActive: true } } }
      });
      if (!processCategory || !processCategory.category.isActive) throw new Error('Categoría no encontrada');
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

