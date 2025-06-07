import { z } from 'zod';

export const dateTimeString = z.string().datetime({ offset: true });

export const dateRangeSchema = z.object({
  from: dateTimeString.optional(),
  to: dateTimeString.optional(),
});

export const processIdSchema = z.object({
  from: dateTimeString.optional(),
  to: dateTimeString.optional(),
  processId: z.string().min(1, 'processId es requerido'),
});
