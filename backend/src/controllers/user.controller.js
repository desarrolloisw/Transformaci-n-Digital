/**
 * User controller
 *
 * Handles user management requests, including retrieval, updates, enabling/disabling, and user type queries. Delegates business logic to the user service layer.
 *
 * Exports:
 *   - getAllUsers: Retrieve all users
 *   - getUser: Retrieve a user by ID
 *   - updateEmailController: Update a user's email
 *   - updateUsernameController: Update a user's username
 *   - updateCompleteNameController: Update a user's full name
 *   - updatePasswordController: Update a user's password
 *   - disabledEnabledUserController: Enable or disable a user
 *   - getUserTypesController: Retrieve all user types
 */

import {
    getUsers,
    getUserById,
    updateEmail,
    updateUsername,
    updateCompleteName,
    updatePassword,
    disabledEnabledUser,
    getUserTypes
} from "../services/user.service.js";

/**
 * Retrieve all users.
 * @param {Request} req
 * @param {Response} res
 */
export async function getAllUsers(req, res) {
    try {
        await getUsers(req, res);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({
            message: "Error al obtener usuarios",
            error: error.message
        });
    }
}

/**
 * Retrieve a user by ID.
 * @param {Request} req
 * @param {Response} res
 */
export async function getUser(req, res) {
    try {
        await getUserById(req, res);
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        res.status(400).json({
            message: "Error al obtener usuario",
            error: error.message
        });
    }
}

/**
 * Update a user's email.
 * @param {Request} req
 * @param {Response} res
 */
export async function updateEmailController(req, res) {
    try {
        await updateEmail(req, res);
    } catch (error) {
        console.error("Error al actualizar email:", error);
        res.status(400).json({
            message: "Error al actualizar email",
            error: error.message
        });
    }
}

/**
 * Update a user's username.
 * @param {Request} req
 * @param {Response} res
 */
export async function updateUsernameController(req, res) {
    try {
        await updateUsername(req, res);
    } catch (error) {
        console.error("Error al actualizar username:", error);
        res.status(400).json({
            message: "Error al actualizar username",
            error: error.message
        });
    }
}

/**
 * Update a user's full name.
 * @param {Request} req
 * @param {Response} res
 */
export async function updateCompleteNameController(req, res) {
    try {
        await updateCompleteName(req, res);
    } catch (error) {
        console.error("Error al actualizar nombre completo:", error);
        res.status(400).json({
            message: "Error al actualizar nombre completo",
            error: error.message
        });
    }
}

/**
 * Update a user's password.
 * @param {Request} req
 * @param {Response} res
 */
export async function updatePasswordController(req, res) {
    try {
        await updatePassword(req, res);
    } catch (error) {
        console.error("Error al actualizar contraseña:", error);
        res.status(400).json({
            message: "Error al actualizar contraseña",
            error: error.message
        });
    }
}

/**
 * Enable or disable a user.
 * @param {Request} req
 * @param {Response} res
 */
export async function disabledEnabledUserController(req, res) {
    try {
        await disabledEnabledUser(req, res);
    } catch (error) {
        console.error("Error al actualizar estado del usuario:", error);
        res.status(400).json({
            message: "Error al actualizar estado del usuario",
            error: error.message
        });
    }
}

/**
 * Retrieve all user types.
 * @param {Request} req
 * @param {Response} res
 */
export async function getUserTypesController(req, res) {
    try {
        const userTypes = await getUserTypes();
        res.status(200).json(userTypes);
    } catch (error) {
        console.error("Error al obtener tipos de usuario:", error);
        res.status(500).json({
            message: "Error al obtener tipos de usuario",
            error: error.message
        });
    }
}