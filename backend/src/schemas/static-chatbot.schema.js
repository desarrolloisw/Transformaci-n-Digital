import { z } from 'zod';

export const chatbotMessageSchema = z.object({
  step: z.enum(['initial', 'process', 'category']),
  processId: z.number().optional(),
  categoryId: z.number().optional()
});