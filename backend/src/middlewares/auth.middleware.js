import { registerSchema } from '../schemas/auth.schema.js';

export const validateRegister = (req, res, next) => {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: 'Datos de registro inválidos',
            errors: result.error.errors
        });
    }

    // Convert email en minusculas to lowercase
    req.body.email = req.body.email.toLowerCase();
    // Convert username to lowercase
    req.body.username = req.body.username.toLowerCase();
    next();
};
