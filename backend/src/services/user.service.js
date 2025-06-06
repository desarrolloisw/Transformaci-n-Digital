import { prisma } from '../libs/prisma.lib.js';
import { hashPassword } from '../config/bcrypt.config.js';
import { decrypt, deterministicEncrypt } from '../config/crypto.config.js';
import { registerSchema } from '../schemas/auth.schema.js';
import { updateEmailSchema, updateUsernameSchema, updatePasswordSchema, updateCompleteNameSchema, disabledEnabledUserSchema } from '../schemas/user.schema.js';

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                lastName: true,
                secondLastName: true,
                createdAt: true,
                updatedAt: true
            }
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
}

export async function getUserById(req, res) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'ID de usuario es requerido' });
    }
    const userId = parseInt(id, 10);
    if (isNaN(userId) || userId <= 0) {
        return res.status(400).json({ message: 'ID de usuario inválido' });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                name: true,
                lastName: true,
                secondLastName: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });
        if (user && user.email) {
            user.email = decrypt(user.email);
        }
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener usuario por ID:', error);
        return res.status(500).json({ message: 'Error al obtener usuario' });
    }
}

export const updateEmail = async (req, res) => {
    const { id } = req.params;
    const userId = parseInt(id, 10);
    if (!id || isNaN(userId) || userId <= 0) {
        return res.status(400).json({ message: 'ID de usuario inválido' });
    }
    const parse = updateEmailSchema.safeParse(req.body);
    if (!parse.success) {
        return res.status(400).json({ errors: parse.error.flatten().fieldErrors });
    }
    const { email } = parse.data;
    try {
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user) throw new Error('Usuario no encontrado');
            const encryptedEmail = deterministicEncrypt(email);
            const existingEmailUser = await tx.user.findFirst({ where: { email: encryptedEmail, id: { not: userId } } });
            if (existingEmailUser) throw new Error('El email ya está en uso por otro usuario');
            const updatedUser = await tx.user.update({ where: { id: userId }, data: { email: encryptedEmail } });
            return updatedUser;
        });
        res.status(200).json({
            id: result.id,
            username: result.username,
            name: result.name,
            lastName: result.lastName,
            secondLastName: result.secondLastName,
            email: decrypt(result.email),
            createdAt: result.createdAt,
            updatedAt: result.updatedAt
        });
    } catch (error) {
        res.status(400).json({ message: error.message || 'Error al actualizar email' });
    }
};

export const updateUsername = async (req, res) => {
    const { id } = req.params;
    const userId = parseInt(id, 10);
    if (!id || isNaN(userId) || userId <= 0) {
        return res.status(400).json({ message: 'ID de usuario inválido' });
    }
    const parse = updateUsernameSchema.safeParse(req.body);
    if (!parse.success) {
        return res.status(400).json({ errors: parse.error.flatten().fieldErrors });
    }
    const { username } = parse.data;
    try {
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user) throw new Error('Usuario no encontrado');
            const existingUser = await tx.user.findUnique({ where: { username } });
            if (existingUser && existingUser.id !== userId) throw new Error('El nombre de usuario ya está en uso');
            const updatedUser = await tx.user.update({ where: { id: userId }, data: { username } });
            return updatedUser;
        });
        res.status(200).json({
            id: result.id,
            username: result.username,
            name: result.name,
            lastName: result.lastName,
            secondLastName: result.secondLastName,
            email: decrypt(result.email),
            createdAt: result.createdAt,
            updatedAt: result.updatedAt
        });
    } catch (error) {
        res.status(400).json({ message: error.message || 'Error al actualizar username' });
    }
};

export const updateCompleteName = async (req, res) => {
    const { id } = req.params;
    const userId = parseInt(id, 10);
    if (!id || isNaN(userId) || userId <= 0) {
        return res.status(400).json({ message: 'ID de usuario inválido' });
    }
    const parse = updateCompleteNameSchema.safeParse(req.body);
    if (!parse.success) {
        return res.status(400).json({ errors: parse.error.flatten().fieldErrors });
    }
    const { name, lastName, secondLastName } = parse.data;
    try {
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user) throw new Error('Usuario no encontrado');
            const updatedUser = await tx.user.update({ where: { id: userId }, data: { name, lastName, secondLastName } });
            return updatedUser;
        });
        res.status(200).json({
            id: result.id,
            username: result.username,
            name: result.name,
            lastName: result.lastName,
            secondLastName: result.secondLastName,
            email: decrypt(result.email),
            createdAt: result.createdAt,
            updatedAt: result.updatedAt
        });
    } catch (error) {
        res.status(400).json({ message: error.message || 'Error al actualizar nombre completo' });
    }
};

export const updatePassword = async (req, res) => {
    const { id } = req.params;
    const userId = parseInt(id, 10);
    if (!id || isNaN(userId) || userId <= 0) {
        return res.status(400).json({ message: 'ID de usuario inválido' });
    }
    const parse = updatePasswordSchema.safeParse(req.body);
    if (!parse.success) {
        return res.status(400).json({ errors: parse.error.flatten().fieldErrors });
    }
    const { newPassword } = parse.data;
    try {
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user) throw new Error('Usuario no encontrado');
            const hashedPassword = await hashPassword(newPassword);
            const updatedUser = await tx.user.update({ where: { id: userId }, data: { password: hashedPassword } });
            return updatedUser;
        });
        res.status(200).json({
            id: result.id,
            username: result.username,
            name: result.name,
            lastName: result.lastName,
            secondLastName: result.secondLastName,
            email: decrypt(result.email),
            createdAt: result.createdAt,
            updatedAt: result.updatedAt
        });
    } catch (error) {
        res.status(400).json({ message: error.message || 'Error al actualizar contraseña' });
    }
};

export const disabledEnabledUser = async (req, res) => {
    const { id } = req.params;
    const userId = parseInt(id, 10);
    if (!id || isNaN(userId) || userId <= 0) {
        return res.status(400).json({ message: 'ID de usuario inválido' });
    }
    const parse = disabledEnabledUserSchema.safeParse(req.body);
    if (!parse.success) {
        return res.status(400).json({ errors: parse.error.flatten().fieldErrors });
    }
    const { isEnabled } = parse.data;
    try {
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user) throw new Error('Usuario no encontrado');
            const updatedUser = await tx.user.update({ where: { id: userId }, data: { isActive: isEnabled } });
            return updatedUser;
        });
        res.status(200).json({
            id: result.id,
            username: result.username,
            name: result.name,
            lastName: result.lastName,
            secondLastName: result.secondLastName,
            email: decrypt(result.email),
            isActive: result.isActive,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt
        });
    } catch (error) {
        res.status(400).json({ message: error.message || 'Error al actualizar estado del usuario' });
    }
};

export async function getUserTypes() {
    try {
        const userTypes = await prisma.userType.findMany({
            select: {
                id: true,
                name: true
            }
        });
        return userTypes;
    } catch (error) {
        console.error('Error al obtener tipos de usuario:', error);
        throw new Error('Error al obtener tipos de usuario');
    }
}

