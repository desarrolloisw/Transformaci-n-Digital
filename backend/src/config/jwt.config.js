/**
 * JWT configuration
 *
 * Provides configuration constants for JWT authentication, including secret key, algorithm, and expiration time.
 *
 * Exports:
 *   - secretKey: Secret key for signing JWT tokens
 *   - algorithm: Algorithm used for JWT signing
 *   - expirationTime: Token expiration time (default: 1 day)
 */

export const secretKey = process.env.JWT_SECRET || 'S#3$3cR3tK3y';
export const algorithm = process.env.JWT_ALGORITHM || 'HS256';
export const expirationTime = process.env.JWT_EXPIRATION_TIME || '1d';