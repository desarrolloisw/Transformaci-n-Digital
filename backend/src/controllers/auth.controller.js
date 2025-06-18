/**
 * Authentication controller
 *
 * Handles user registration and login requests. Delegates business logic to the authentication service layer.
 *
 * Exports:
 *   - register: Handles user registration
 *   - login: Handles user login
 */

import { registerUserService, loginUserService } from "../services/auth.service.js";

/**
 * Register a new user.
 * Receives user data from the request body and returns the created user or an error message.
 * @param {Request} req
 * @param {Response} res
 */
export async function register(req, res) {
    try {
        const userData = req.body;
        const newUser = await registerUserService(userData);
        res.status(201).json({
            message: "Usuario registrado exitosamente",
            user: newUser
        });
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(400).json({
            message: "Error al registrar el usuario",
            error: error.message
        });
    }
}

/**
 * Authenticate a user and return user data if successful.
 * Receives identifier and password from the request body.
 * @param {Request} req
 * @param {Response} res
 */
export async function login(req, res) {
    try {
        const { identifier, password } = req.body;
        const user = await loginUserService({ identifier, password });
        res.status(200).json({
            message: "Inicio de sesión exitoso",
            user
        });
    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        res.status(400).json({
            message: "Error al iniciar sesión",
            error: error.message
        });
    }
}

