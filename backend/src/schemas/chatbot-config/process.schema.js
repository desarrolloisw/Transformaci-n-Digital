import { z } from 'zod';

export const processSchema = z.object({
  name: z.string({ required_error: 'Nombre es requerido.' })
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
    .max(100, { message: 'El nombre debe tener máximo 100 caracteres.' }),
  description: z.string({ required_error: 'Descripción es requerida.' })
    .min(2, { message: 'La descripción debe tener al menos 2 caracteres.' }),
  isActive: z.boolean({ required_error: 'El estado activo es requerido.' }),
  userId: z.number({ required_error: 'El ID del usuario es requerido.' })
    .int({ message: 'El ID del usuario debe ser un número entero.' })
    .positive({ message: 'El ID del usuario debe ser un número positivo.' })
});

export const processUpdateSchema = z.object({
  name: z.string()
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
    .max(100, { message: 'El nombre debe tener máximo 100 caracteres.' })
    .optional(),
  description: z.string()
    .min(2, { message: 'La descripción debe tener al menos 2 caracteres.' })
    .optional(),
  isActive: z.boolean({ required_error: 'El estado activo es requerido.' })
    .optional()
});

export const processConfirmationSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    isActive: z.boolean(),
    createdAt: z.any(),
    updatedAt: z.any(),
    disabledFaqs: z.array(z.number()).optional(),
    enabledFaqs: z.array(z.number()).optional(),
    noChanges: z.boolean().optional(),
});