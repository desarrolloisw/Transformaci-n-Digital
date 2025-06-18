/**
 * Authentication and authorization middleware
 *
 * Provides middleware functions for validating registration and login data, authenticating JWT tokens, and checking user roles.
 *
 * Exports:
 *   - validateRegister: Validates registration data and normalizes email/username
 *   - validateLogin: Validates login data and normalizes identifier
 *   - authenticateToken: Verifies JWT token and attaches user to request
 *   - isPAT: Allows only users with PAT role (userTypeId === 1)
 *   - isCoord: Allows only users with Coordinator role (userTypeId === 2)
 *   - isAny: Allows users with either PAT or Coordinator roles
 */

import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { verifyToken } from '../libs/jwt.lib.js';

/**
 * Validate registration data and normalize email/username to lowercase.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export const validateRegister = (req, res, next) => {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            message: 'Invalid registration data',
            errors: result.error.errors
        });
    }
    req.body.email = req.body.email.toLowerCase();
    req.body.username = req.body.username.toLowerCase();
    next();
};

/**
 * Validate login data and normalize identifier to lowercase.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export const validateLogin = (req, res, next) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            message: 'Invalid login data',
            errors: result.error.errors
        });
    }
    req.body.identifier = req.body.identifier.toLowerCase();
    next();
};

/**
 * Authenticate JWT token and attach user to request.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export async function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json({ message: 'No active session' });
    }
    try {
        const decoded = await verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: error.message || 'Token not generated' });
    }
}

/**
 * Allow only users with PAT role (userTypeId === 1).
 */
export function isPAT(req, res, next) {
    if (req.user && req.user.userTypeId === 1) {
        return next();
    }
    return res.status(403).json({ message: 'Access denied. Requires PAT permissions.' });
}

/**
 * Allow only users with Coordinator role (userTypeId === 2).
 */
export function isCoord(req, res, next) {
    if (req.user && req.user.userTypeId === 2) {
        return next();
    }
    return res.status(403).json({ message: 'Access denied. Requires Coordinator permissions.' });
}

/**
 * Allow users with either PAT or Coordinator roles (userTypeId === 1 or 2).
 */
export function isAny(req, res, next) {
    if (req.user && (req.user.userTypeId === 1 || req.user.userTypeId === 2)) {
        return next();
    }
    return res.status(403).json({ message: 'Access denied. Requires PAT or Coordinator permissions.' });
}