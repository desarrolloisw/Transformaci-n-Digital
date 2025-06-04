import { z } from 'zod';

const registerSchema = z.object({
  username: z.string({ required_error: 'Nombre de Usuario es requerido.' }).min(5, "El nombre de usuario debe tener al menos 5 caracteres.").regex(/^[a-z0-9_]+$/, "El nombre de usuario solo puede contener letras minúsculas, números y guiones bajos."),
  name: z.string({ required_error: 'Nombre es requerido.' }).min(1, "El nombre debe tener al menos 1 carácter."),
  lastname: z.string({ required_error: 'Primer apellido es requerido.' }).min(1, "El primer apellido debe tener al menos 1 carácter."),
  secondlastname: z.string().optional(),
  email: z.string({ required_error: 'Correo es requerido.' }).email("El correo electrónico no es válido.").regex(/@unison\.mx$/, "El correo debe ser de la UNISON."),
  password: z.string({ required_error: 'Contraseña es requerido.' }).min(8, "La contraseña debe tener al menos 8 caracteres").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial."),
  confirmPassword: z.string({ required_error: 'Confirmación de contraseña es requerida.' }).min(8, "La confirmación de contraseña debe tener al menos 8 caracteres").refine((val, ctx) => {
    if (val !== ctx.parent.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Las contraseñas no coinciden.",
      });
      return false;
    }
    return true;
  }),
  userTypeId: z.number({ required_error: 'Tipo de usuario es requerido.' }).int().positive("Tipo de usuario no válido"),
});

export const authSchemas = {
    registerSchema,
}