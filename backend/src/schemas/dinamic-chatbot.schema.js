/**
 * Dynamic Chatbot message validation schema
 *
 * Provides a Zod schema for validating messages sent to the dynamic chatbot endpoint.
 *
 * Exports:
 *   - dinamicChatbotMessageSchema: Validates message and optional history for dynamic chatbot requests
 */

import { z } from 'zod';

export const dinamicChatbotMessageSchema = z.object({
  message: z.string().min(2, 'El mensaje es requerido'),
  history: z.array(z.object({
    role: z.enum(['user', 'bot']),
    message: z.string()
  })).optional()
});
