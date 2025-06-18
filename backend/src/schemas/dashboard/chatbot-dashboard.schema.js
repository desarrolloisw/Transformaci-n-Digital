/**
 * Chatbot Dashboard validation schemas
 *
 * Provides Zod schemas for validating date ranges and process ID filters for dashboard analytics endpoints.
 *
 * Exports:
 *   - dateTimeString: Zod string schema for ISO datetime with offset
 *   - dateRangeSchema: Validates optional 'from' and 'to' date fields
 *   - processIdSchema: Validates optional 'from', 'to', and required 'processId' fields
 */

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
