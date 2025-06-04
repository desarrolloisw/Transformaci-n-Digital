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