import { z } from 'zod';

export const dinamicChatbotMessageSchema = z.object({
  message: z.string().min(2, 'El mensaje es requerido'),
  history: z.array(z.object({
    role: z.enum(['user', 'bot']),
    message: z.string()
  })).optional()
});
