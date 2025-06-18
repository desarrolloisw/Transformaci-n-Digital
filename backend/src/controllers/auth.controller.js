import { registerUserService, loginUserService } from "../services/auth.service.js";

export async function register(req, res) {
    try {
        console.log('auth.controller.js - register');
        const userData = req.body;
        const newUser = await registerUserService(userData);
        res.status(201).json({
            message: "Usuario registrado exitosamente",
            user: newUser
        });
    }catch (error) {
        console.error("Error en el registro:", error);
        console.log(error)
        res.status(400).json({
            message: "Error al registrar el usuario",
            error: error.message
        });
    }
}

export async function login(req, res) {
    try {
        const { identifier, password } = req.body;
        const user = await loginUserService({identifier, password});
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

