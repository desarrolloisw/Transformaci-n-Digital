/**
 * Bcrypt configuration and utilities
 *
 * Provides functions for hashing and comparing passwords using bcrypt.
 *
 * Exports:
 *   - hashPassword: Hashes a plain text password
 *   - comparePassword: Compares a plain text password with a hashed password
 */

import bcrypt from 'bcrypt';

const saltRounds = 10;

/**
 * Hash a plain text password using bcrypt.
 * @param {string} password - The plain text password to hash.
 * @returns {Promise<string>} The hashed password.
 * @throws {Error} If the password is missing or hashing fails.
 */
const hashPassword = async (password) => {
    if (!password) throw new Error('Password is required.');
    try {
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
};

/**
 * Compare a plain text password with a stored hashed password.
 * @param {string} password - The plain text password to compare.
 * @param {string} storedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} True if passwords match, false otherwise.
 * @throws {Error} If comparison fails.
 */
const comparePassword = async (password, storedPassword) => {
    if (!password || !storedPassword) return false;
    try {
        return await bcrypt.compare(password, storedPassword);
    } catch (error) {
        console.error('Error comparing passwords:', error);
        throw error;
    }
};

export { hashPassword, comparePassword };