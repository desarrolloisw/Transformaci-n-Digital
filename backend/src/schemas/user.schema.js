/**
 * User validation schemas
 *
 * Provides Zod schemas for validating user update operations, including email, username, name, password, and enabled/disabled state.
 *
 * Exports:
 *   - updateEmailSchema: Validates email updates
 *   - updateUsernameSchema: Validates username updates
 *   - updateCompleteNameSchema: Validates name and lastname updates
 *   - updatePasswordSchema: Validates password updates and confirmation
 *   - disabledEnabledUserSchema: Validates enabled/disabled state
 */

import { z } from 'zod';

export const updateEmailSchema = z.object({
    email: z
        .string()
        .email('El correo electrónico debe ser válido')
        .min(1, 'El correo electrónico es obligatorio')
        .max(100, 'El correo electrónico no puede exceder los 100 caracteres')
        .regex(/@unison\.mx$/, 'El correo debe ser de la UNISON.')
        .transform((val) => val.toLowerCase()),
});

export const updateUsernameSchema = z.object({
    username: z
        .string()
        .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
        .max(25, 'El nombre de usuario no puede exceder los 25 caracteres')
        .regex(/^[a-z0-9_]+$/, 'El nombre de usuario solo puede contener minúsculas, números y guion bajo')
        .transform((val) => val.toLowerCase()),
});

export const updateCompleteNameSchema = z.object({
    name: z
        .string()
        .min(1, 'El nombre es obligatorio')
        .max(50, 'El nombre no puede exceder los 50 caracteres'),
    lastName: z
        .string()
        .min(1, 'El apellido paterno es obligatorio')
        .max(50, 'El apellido paterno no puede exceder los 50 caracteres'),
    secondLastName: z
        .string()
        .max(50, 'El apellido materno no puede exceder los 50 caracteres')
        .optional(),
});

export const updatePasswordSchema = z.object({
    newPassword: z
        .string()
        .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
        .max(72, 'La nueva contraseña no debe sobrepasar los 72 caracteres')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            'La nueva contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial'
        ),
    confirmNewPassword: z
        .string()
}).superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Las contraseñas no coinciden',
            path: ['confirmNewPassword']
        });
    }
});

export const disabledEnabledUserSchema = z.object({
    isEnabled: z
        .boolean()
        .refine((val) => val === true || val === false, {
            message: 'El estado debe ser verdadero o falso'
        })
});