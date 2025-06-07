import { z } from 'zod';

export const processSchema = z.object({
  name: z.string({ required_error: 'Nombre es requerido.' })
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
    .max(100, { message: 'El nombre debe tener máximo 100 caracteres.' }),
  description: z.string({ required_error: 'Descripción es requerida.' })
    .min(2, { message: 'La descripción debe tener al menos 2 caracteres.' }),
  isActive: z.boolean({ required_error: 'El estado activo es requerido.' })
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
