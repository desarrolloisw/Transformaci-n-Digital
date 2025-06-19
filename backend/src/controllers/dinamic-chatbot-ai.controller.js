/**
 * Dynamic Chatbot AI controller
 *
 * Handles incoming messages for the dynamic chatbot powered by AI. Validates input and delegates response generation to the AI service layer.
 *
 * Exports:
 *   - dinamicChatbotAIController: Controller with handleMessage method for dynamic chatbot AI requests
 */

import dinamicChatbotAIService from '../services/dinamic-chatbot-ai.service.js';
import { dinamicChatbotMessageSchema } from '../schemas/dinamic-chatbot.schema.js';

export const dinamicChatbotAIController = {
  /**
   * Handle a dynamic chatbot AI message request.
   * Validates the request body and returns the AI chatbot response or an error message.
   * @param {Request} req
   * @param {Response} res
   */
  async handleMessage(req, res) {
    try {
      const { message, history, userId } = dinamicChatbotMessageSchema.extend({ userId: dinamicChatbotMessageSchema.shape.message.optional() }).parse(req.body);
      const response = await dinamicChatbotAIService.getAIResponse({ prompt: message, history, userId });
      return res.json({ response });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
};
