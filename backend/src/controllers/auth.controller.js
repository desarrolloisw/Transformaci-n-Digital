import { registerUserService } from "../services/auth.service.js";

export async function register(req, res) {
    try {
        const userData = req.body;
        const newUser = await registerUserService(userData);
        res.status(201).json({
            message: "Usuario registrado exitosamente",
            user: newUser
        });
    }catch (error) {
        console.error("Error en el registro:", error);
        res.status(400).json({
            message: "Error al registrar el usuario",
            error: error.message
        });
    }
}

export const authController = {
    register,
};