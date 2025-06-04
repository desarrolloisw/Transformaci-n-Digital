import { prisma } from '../libs/prisma.lib.js';

export class StaticChatbotService {
  // Devuelve todos los procesos como opciones iniciales
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

  // Devuelve las categorías de un proceso
  static async getCategoriesByProcess(processId) {
    const categories = await prisma.processCategory.findMany({
      where: { processId: Number(processId) },
      select: { id: true, category: { select: { name: true } } }
    });
    return {
      type: 'options',
      message: 'Selecciona una categoría:',
      options: categories.map(c => ({ id: c.id, label: c.category.name }))
    };
  }

  // Devuelve la respuesta de una categoría
  static async getResponseByCategory(categoryId) {
    const category = await prisma.processCategory.findUnique({
      where: { id: Number(categoryId) },
      select: { response: true, category: { select: { name: true } } }
    });
    if (!category) throw new Error('Categoría no encontrada');
    return {
      type: 'response',
      message: category.response,
      category: category.category.name
    };
  }
}

