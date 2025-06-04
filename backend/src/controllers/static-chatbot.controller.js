import { StaticChatbotService } from '../services/static-chatbot.service.js';
import { chatbotMessageSchema } from '../schemas/static-chatbot.schema.js';

export const staticChatbotController = {
  async handleMessage(req, res) {
    try {
      const { step, processId, categoryId } = chatbotMessageSchema.parse(req.body);

      let result;
      if (step === 'initial') {
        result = await StaticChatbotService.getInitialOptions();
      } else if (step === 'process' && processId) {
        result = await StaticChatbotService.getCategoriesByProcess(processId);
      } else if (step === 'category' && categoryId) {
        result = await StaticChatbotService.getResponseByCategory(categoryId);
      } else {
        return res.status(400).json({ error: 'Parámetros inválidos' });
      }

      // Botones de navegación
      let navigation = [];
      if (step === 'process' || step === 'category') {
        navigation.push({ action: 'back', label: 'Volver al inicio' });
      }
      if (step === 'category' && processId) {
        navigation.push({ action: 'backToProcess', label: 'Volver a categorías', processId });
      }

      return res.json({ ...result, navigation });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
};