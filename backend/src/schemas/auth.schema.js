import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string({ required_error: 'Nombre de Usuario es requerido.' })
    .min(5, "El nombre de usuario debe tener al menos 5 caracteres.")
    .max(25, "El nombre de usuario debe tener máxmio 25 caracteres")
    .regex(/^[a-z0-9_]+$/, "El nombre de usuario solo puede contener letras minúsculas, números y guiones bajos.")
    .transform(val => val.toLowerCase()),
  name: z.string({ required_error: 'Nombre es requerido.' })
    .min(1, "El nombre debe tener al menos 1 carácter.")
    .max(50, "El nombre no puede exceder los 50 caracteres."),
  lastname: z.string({ required_error: 'Primer apellido es requerido.' })
    .min(1, "El primer apellido debe tener al menos 1 carácter.")
    .max(50, "El primer apellido no puede exceder los 50 caracteres."),
  secondlastname: z.string()
    .min(1, "El segundo apellido debe tener al menos 1 carácter.")
    .max(50, "El segundo apellido no puede exceder los 50 caracteres.")
    .optional(),
  email: z.string({ required_error: 'Correo es requerido.' })
    .email("El correo electrónico no es válido.")
    .max(100, "El correo electrónico no debe de contener más de 100 caracteres")
    .regex(/@unison\.mx$/, "El correo debe ser de la UNISON.")
    .transform(val => val.toLowerCase()),
  password: z.string({ required_error: 'Contraseña es requerido.' })
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(72, "La contraseña no debe sobrepasar los 72 caracteres")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial."),
  confirmPassword: z.string({ required_error: 'Confirmación de contraseña es requerida.' })
    .min(8, "La confirmación de contraseña debe tener al menos 8 caracteres"),
  userTypeId: z.number({ required_error: 'Tipo de usuario es requerido.' }).int().positive("Tipo de usuario no válido"),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      path: ['confirmPassword'],
      code: z.ZodIssueCode.custom,
      message: "Las contraseñas no coinciden.",
    });
  }
});

export const loginSchema = z.object({
  identifier: z.string({ required_error: 'Email o username es requerido.' })
    .min(3, "El email o username debe tener al menos 3 caracteres.")
    .max(100, "El email o username no debe sobrepasar los 100 caracteres.")
    .transform(val => val.toLowerCase()),
  password: z.string({ required_error: 'Contraseña es requerida.' })
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .max(72, "La contraseña no debe sobrepasar los 72 caracteres."),
}).superRefine((data, ctx) => {
  if (data.identifier.includes('@')) {
    // Es correo: debe ser válido de la UNISON y máximo 100 caracteres
    if (!/^([a-zA-Z0-9_.+-])+@unison\.mx$/.test(data.identifier)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El correo debe ser un correo válido de la UNISON (usuario@unison.mx)."
      });
    }
    if (data.identifier.length > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        maximum: 100,
        type: "string",
        inclusive: true,
        message: "El correo no debe sobrepasar los 100 caracteres."
      });
    }
  } else {
    // Es username: solo minúsculas, números y guion bajo, y máximo 25 caracteres
    if (!/^[a-z0-9_]+$/.test(data.identifier)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El nombre de usuario solo puede contener minúsculas, números y guion bajo."
      });
    }
    if (data.identifier.length > 25) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        maximum: 25,
        type: "string",
        inclusive: true,
        message: "El nombre de usuario no debe sobrepasar los 25 caracteres."
      });
    }
  }
});