/**
 * Authentication service
 *
 * Provides business logic for user registration and login, including validation, password hashing, encryption, and token generation.
 *
 * Exports:
 *   - registerUserService: Register a new user
 *   - loginUserService: Authenticate a user and return user data and token
 */

import { prisma } from "../libs/prisma.lib.js";
import { hashPassword, comparePassword } from "../config/bcrypt.config.js";
import { encrypt, decrypt, deterministicEncrypt } from "../config/crypto.config.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { generateToken } from "../libs/jwt.lib.js";

/**
 * Register a new user with validation, password hashing, and email encryption.
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} The created user (without password)
 * @throws {Error} If validation fails or user/email already exists
 */
export async function registerUserService(userData) {
    try {
        return await prisma.$transaction(async (tx) => {
            const { username, name, lastname, secondlastname, email, password, userTypeId, confirmPassword } = userData;

            const parsedData = registerSchema.parse({
                username,
                name,
                lastname,
                secondlastname,
                email,
                password,
                confirmPassword,
                userTypeId
            });

            const encryptedEmail = deterministicEncrypt(parsedData.email);
            const existingEmail = await prisma.user.findUnique({
                where: { email: encryptedEmail }
            });
            if (existingEmail) {
                throw new Error("El correo electrónico ya está en uso.");
            }


            const existingUsername = await prisma.user.findUnique({
                where: { username: parsedData.username }
            });
            if (existingUsername) {
                throw new Error("El nombre de usuario ya está en uso.");
            }

            const hashedPassword = await hashPassword(parsedData.password);
            const newUser = await tx.user.create({
                data: {
                    username: parsedData.username,
                    name: parsedData.name,
                    lastName: parsedData.lastname,
                    secondLastName: parsedData.secondlastname,
                    email: encryptedEmail,
                    password: hashedPassword,
                    userTypeId: parsedData.userTypeId
                }
            });

            if (!newUser) {
                throw new Error("Error al crear el usuario.");
            }

            const { password: _password, userTypeId: _userTypeId, ...userWithoutPassword } = newUser;
            return userWithoutPassword;
        }
        );
    }catch (error) {
        // Si es un error de Zod
        if (error.name === 'ZodError') {
            throw error;
        }
        // Si es otro error
        throw new Error(error.message);
    }
}

/**
 * Authenticate a user by identifier (email or username) and password.
 * @param {Object} param0 - Object with identifier and password
 * @returns {Promise<Object>} The user data and JWT token
 * @throws {Error} If validation fails, user not found, inactive, or password incorrect
 */
export async function loginUserService({ identifier, password }) {
    try {
        // Validar el esquema de login
        loginSchema.parse({ identifier, password });
        
        // Convertir el identificador a minúsculas
        identifier = identifier.toLowerCase();
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: deterministicEncrypt(identifier) },
                    { username: identifier.toLowerCase() }
                ]
            }
        });

        if (!user) {
            throw new Error("Usuario no encontrado.");
        }

        if (!user.isActive) {
            throw new Error("Usuario inactivo.");
        }

        if (!await comparePassword(password, user.password)) {
            throw new Error("Contraseña incorrecta.");
        }

        const token = generateToken({
            id: user.id,
            username: user.username,
            email: decrypt(user.email),
            userTypeId: user.userTypeId
        });
        const { password: _password, userTypeId: _userTypeId, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            token
        };
    } catch (error) {
        // Si es un error de Zod
        if (error.name === 'ZodError') {
            throw error;
        }
        // Si es otro error
        throw new Error(error.message);
    }
}
