/**
 * JWT utility functions
 *
 * Provides functions for generating and verifying JWT tokens for user authentication.
 *
 * Exports:
 *   - generateToken: Generates a JWT token for a user
 *   - verifyToken: Verifies a JWT token and returns the decoded payload
 */

import jwt from "jsonwebtoken";
import { algorithm, expirationTime, secretKey } from "../config/jwt.config.js";

/**
 * Generates a JWT token for a user.
 * @param {Object} user - The user object containing user details.
 * @returns {string} The generated JWT token.
 */
export function generateToken(user) {
    const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        userTypeId: user.userTypeId
    };

    const options = {
        algorithm: algorithm,
        expiresIn: expirationTime
    };

    return jwt.sign(payload, secretKey, options);
}

/**
 * Verifies a JWT token and returns the decoded payload if valid.
 * Throws a custom error with a clear message if invalid or expired.
 * @param {string} token - The JWT token to verify.
 * @returns {Promise<Object>} The decoded payload.
 * @throws {Error} If the token is missing, invalid, or expired.
 */
export async function verifyToken(token) {
    if (!token || typeof token !== 'string') {
        throw new Error('Token not provided or invalid.');
    }

    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, { algorithms: [algorithm] }, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return reject(new Error('The token has expired.'));
                }
                if (err.name === 'JsonWebTokenError') {
                    return reject(new Error('Invalid token.'));
                }
                return reject(new Error('Error verifying token.'));
            }
            resolve(decoded);
        });
    });
}