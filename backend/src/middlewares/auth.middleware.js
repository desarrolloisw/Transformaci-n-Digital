import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { verifyToken } from '../libs/jwt.lib.js';

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

export const validateLogin = (req, res, next) => {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: 'Datos de inicio de sesión inválidos',
            errors: result.error.errors
        });
    }

    // Convert identifier to lowercase
    req.body.identifier = req.body.identifier.toLowerCase();
    next();
};

export async function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'No tienes sesión activa' });
    }

    try {
        const decoded = await verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error al verificar el token:', error);
        // Mensaje más claro según el error
        return res.status(401).json({ message: error.message || 'Token no generado' });
    }
}

export function isPAT(req, res, next) {
    if (req.user && req.user.userTypeId === 1) { // Asumiendo que el userTypeId 1 es para PAT
        return next();
    }
    return res.status(403).json({ message: 'Acceso denegado. Requiere permisos de Personal Académico Técnico.' });
}

export function isCoord(req, res, next) {
    if (req.user && req.user.userTypeId === 2) { // Asumiendo que el userTypeId 2 es para Coordinador
        return next();
    }
    return res.status(403).json({ message: 'Acceso denegado. Requiere permisos de Coordinador.' });
}

export function isAny(req, res, next) {
    if (req.user && (req.user.userTypeId === 1 || req.user.userTypeId === 2)) { // Asumiendo que el userTypeId 1 es para PAT y 2 para Coordinador
        return next();
    }
    return res.status(403).json({ message: 'Acceso denegado. Requiere permisos de Personal Académico Técnico o Coordinador.' });
}