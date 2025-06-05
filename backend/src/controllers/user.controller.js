import {
    getUsers,
    getUserById,
    createUser,
    updateEmail,
    updateUsername,
    updateCompleteName,
    updatePassword,
    disabledEnabledUser,
    getUserTypes
} from "../services/user.service.js";

// Obtener todos los usuarios
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

// Obtener usuario por ID
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

// Crear usuario
export async function createUserController(req, res) {
    try {
        await createUser(req, res);
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(400).json({
            message: "Error al crear usuario",
            error: error.message
        });
    }
}

// Actualizar email
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

// Actualizar username
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

// Actualizar nombre completo
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

// Actualizar contraseña
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

// Habilitar/deshabilitar usuario
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

// Obtener todos los tipos de usuario
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