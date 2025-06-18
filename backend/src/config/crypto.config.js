/**
 * Crypto configuration and utilities
 *
 * Provides functions for encrypting and decrypting text using AES-256-CBC, including deterministic encryption.
 *
 * Exports:
 *   - encrypt: Encrypts plain text with a random IV
 *   - decrypt: Decrypts text encrypted with encrypt()
 *   - deterministicEncrypt: Encrypts text with a fixed IV (deterministic output)
 *   - ENCRYPTION_KEY: The encryption key used for all operations
 */

import crypto from 'crypto';

// Encryption key (32 bytes, padded or truncated as needed)
const ENCRYPTION_KEY = (process.env.ENCRYPTION_KEY || 'default-encryption-key').padEnd(32, '0').slice(0, 32);
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // For AES, IV must be 16 bytes

/**
 * Encrypt plain text using AES-256-CBC with a random IV.
 * @param {string} text - The plain text to encrypt.
 * @returns {string} The IV and encrypted text, separated by a colon.
 * @throws {Error} If encryption fails.
 */
const encrypt = (text) => {
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'utf8'), iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
        console.error('Error encrypting text:', error);
        throw new Error('Error encrypting text');
    }
};

/**
 * Decrypt text encrypted with encrypt().
 * @param {string} encryptedText - The IV and encrypted text, separated by a colon.
 * @returns {string} The decrypted plain text.
 * @throws {Error} If decryption fails or input is invalid.
 */
const decrypt = (encryptedText) => {
    try {
        const [ivHex, encrypted] = encryptedText.split(':');
        if (!ivHex || !encrypted) {
            throw new Error('Invalid encrypted text');
        }
        const iv = Buffer.from(ivHex, 'hex');
        const encryptedBuffer = Buffer.from(encrypted, 'hex');
        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'utf8'), iv);
        let decrypted = decipher.update(encryptedBuffer, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error('Error decrypting text:', error);
        throw new Error('Error decrypting text');
    }
};

/**
 * Deterministically encrypt plain text using AES-256-CBC with a fixed IV.
 * Always produces the same output for the same input and key.
 * @param {string} text - The plain text to encrypt.
 * @returns {string} The fixed IV and encrypted text, separated by a colon.
 * @throws {Error} If encryption fails.
 */
const deterministicEncrypt = (text) => {
    try {
        const iv = Buffer.alloc(IV_LENGTH, 0); // Fixed IV of 16 zero bytes
        const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'utf8'), iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
        console.error('Error encrypting text (deterministic):', error);
        throw new Error('Error encrypting text (deterministic)');
    }
};

export { encrypt, deterministicEncrypt, decrypt, ENCRYPTION_KEY };