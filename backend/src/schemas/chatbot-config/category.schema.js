/**
 * Category validation schemas
 *
 * Provides Zod schemas for validating category creation, update, and confirmation data for chatbot configuration.
 *
 * Exports:
 *   - createCategorySchema: Validates data for creating a new category
 *   - updateCategorySchema: Validates data for updating a category
 *   - categoryConfirmationSchema: Validates category confirmation and status data
 */

import { optional, z } from 'zod';

export const createCategorySchema = z.object({
  userId: z.number({ required_error: 'userId is required', invalid_type_error: 'userId must be a number' }),
  name: z.string({ required_error: 'name is required', invalid_type_error: 'name must be a string' })
    .min(2, { message: 'name must be at least 2 characters' })
    .max(100, { message: 'name must be at most 100 characters' }),
  description: z.string({ required_error: 'description is required', invalid_type_error: 'description must be a string' })
    .min(2, { message: 'description must be at least 2 characters' }),
  isActive: z.boolean().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string({ invalid_type_error: 'name must be a string' })
    .min(2, { message: 'name must be at least 2 characters' })
    .max(100, { message: 'name must be at most 100 characters' })
    .optional(),
  description: z.string({ invalid_type_error: 'description must be a string' })
    .min(2, { message: 'description must be at least 2 characters' })
    .optional(),
  isActive: z.boolean().optional(),
});

export const categoryConfirmationSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    isActive: z.boolean().optional(),
    createdAt: z.any().optional(),
    updatedAt: z.any().optional(),
    disabledFaqs: z.array(z.number()).optional(),
    enabledFaqs: z.array(z.number()).optional(),
    alreadyInactive: z.boolean().optional(),
    noChanges: z.boolean().optional(),
});