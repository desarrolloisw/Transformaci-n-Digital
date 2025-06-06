import { DinamicChatbotService } from '../services/dinamic-chatbot.service.js';
import { dinamicChatbotMessageSchema } from '../schemas/dinamic-chatbot.schema.js';

export const dinamicChatbotController = {
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
