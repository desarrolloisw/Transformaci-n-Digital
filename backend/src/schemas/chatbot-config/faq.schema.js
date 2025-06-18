/**
 * FAQ validation schemas
 *
 * Provides Zod schemas for validating FAQ creation, response update, active state toggling, and confirmation data for chatbot configuration.
 *
 * Exports:
 *   - createFaqSchema: Validates data for creating a new FAQ
 *   - updateFaqResponseSchema: Validates data for updating FAQ response
 *   - toggleFaqActiveSchema: Validates data for toggling FAQ active state
 *   - faqConfirmationSchema: Validates FAQ confirmation and status data
 */

import { z } from "zod";

export const createFaqSchema = z.object({
  processId: z.number({ required_error: 'processId es requerido', invalid_type_error: 'processId debe ser número' }),
  categoryId: z.number({ required_error: 'categoryId es requerido', invalid_type_error: 'categoryId debe ser número' }),
  response: z.string({ required_error: 'response es requerido', invalid_type_error: 'response debe ser texto' })
    .min(2, { message: 'response debe tener al menos 2 caracteres' }),
});

export const updateFaqResponseSchema = z.object({
  processId: z.number({ required_error: 'processId es requerido', invalid_type_error: 'processId debe ser número' }),
  categoryId: z.number({ required_error: 'categoryId es requerido', invalid_type_error: 'categoryId debe ser número' }),
  response: z.string({ required_error: 'response es requerido', invalid_type_error: 'response debe ser texto' })
    .min(2, { message: 'response debe tener al menos 2 caracteres' }),
});

export const toggleFaqActiveSchema = z.object({
  processId: z.number({ required_error: 'processId es requerido', invalid_type_error: 'processId debe ser número' }),
  categoryId: z.number({ required_error: 'categoryId es requerido', invalid_type_error: 'categoryId debe ser número' }),
  isActive: z.boolean({ required_error: 'isActive es requerido', invalid_type_error: 'isActive debe ser booleano' }),
});

export const faqConfirmationSchema = z.object({
  id: z.number(),
  processId: z.number(),
  categoryId: z.number(),
  userId: z.number(),
  response: z.string(),
  isActive: z.boolean(),
  createdAt: z.any(),
  updatedAt: z.any(),
  noChanges: z.boolean().optional(),
});
