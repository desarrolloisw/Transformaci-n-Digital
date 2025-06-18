/**
 * Static Chatbot service
 *
 * Provides business logic for the static chatbot, including retrieving initial options, categories by process, and category responses with logging.
 *
 * Exports:
 *   - StaticChatbotService: Class with static methods for chatbot operations
 */

import { prisma } from '../libs/prisma.lib.js';

export class StaticChatbotService {
  /**
   * Get all active processes as initial chatbot options.
   * @returns {Promise<Object>} Options object with process list
   */
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

  /**
   * Get all active categories for a given process.
   * @param {number} processId - The process ID
   * @returns {Promise<Object>} Options object with category list
   */
  static async getCategoriesByProcess(processId) {
    const categories = await prisma.processCategory.findMany({
      where: { processId: Number(processId), isActive: true },
      select: { id: true, category: { select: { name: true, isActive: true } } }
    });
    return {
      type: 'options',
      message: 'Selecciona una categoría:',
      options: categories
        .filter(c => c.category.isActive)
        .map(c => ({ id: c.id, label: c.category.name }))
    };
  }

  /**
   * Get the response for a category and log the action in ProcessCategoryLog (faq_log).
   * @param {number} processCategoryId - The process category ID
   * @returns {Promise<Object>} Response object with message and category name
   * @throws {Error} If action type or category is not found
   */
  static async getResponseByCategory(processCategoryId) {
    return await prisma.$transaction(async (tx) => {
      const actionType = await tx.actionType.findUnique({ where: { name: 'Consultar' } });
      if (!actionType) throw new Error('Tipo de acción "Consultar" no encontrado');
      const processCategory = await tx.processCategory.findUnique({
        where: { id: Number(processCategoryId), isActive: true },
        select: { response: true, category: { select: { name: true, isActive: true } } }
      });
      if (!processCategory || !processCategory.category.isActive) throw new Error('Categoría no encontrada');
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

