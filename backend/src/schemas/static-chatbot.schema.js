/**
 * Static Chatbot message validation schema
 *
 * Provides a Zod schema for validating messages sent to the static chatbot endpoint.
 *
 * Exports:
 *   - chatbotMessageSchema: Validates step, processId, and categoryId for static chatbot requests
 */

import { z } from 'zod';

export const chatbotMessageSchema = z.object({
  step: z.enum(['initial', 'process', 'category']),
  processId: z.number().optional(),
  categoryId: z.number().optional()
});