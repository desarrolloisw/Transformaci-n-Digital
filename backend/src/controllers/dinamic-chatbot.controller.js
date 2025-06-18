/**
 * Dynamic Chatbot controller
 *
 * Handles incoming messages for the dynamic chatbot. Validates input and delegates response generation to the service layer.
 *
 * Exports:
 *   - dinamicChatbotController: Controller with handleMessage method for dynamic chatbot requests
 */

import { DinamicChatbotService } from '../services/dinamic-chatbot.service.js';
import { dinamicChatbotMessageSchema } from '../schemas/dinamic-chatbot.schema.js';

export const dinamicChatbotController = {
  /**
   * Handle a dynamic chatbot message request.
   * Validates the request body and returns the chatbot response or an error message.
   * @param {Request} req
   * @param {Response} res
   */
  async handleMessage(req, res) {
    try {
      const { message, history } = dinamicChatbotMessageSchema.parse(req.body);
      const result = await DinamicChatbotService.getResponse({ message, history });
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
};
