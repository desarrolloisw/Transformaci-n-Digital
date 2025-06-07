import { prisma } from '../libs/prisma.lib.js';
import { hashPassword } from '../config/bcrypt.config.js';
import { decrypt, deterministicEncrypt } from '../config/crypto.config.js';
import { updateEmailSchema, updateUsernameSchema, updatePasswordSchema, updateCompleteNameSchema, disabledEnabledUserSchema } from '../schemas/user.schema.js';
import { DateTime } from 'luxon';

function toHermosillo(dt) {
    if (!dt) return null;
    return DateTime.fromJSDate(dt, { zone: 'utc' }).setZone('America/Hermosillo').toFormat('yyyy-MM-dd HH:mm:ss');
}

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                lastName: true,
                secondLastName: true,
                userType: {
                    select: {
                        name: true
                    }
                },
                createdAt: true,
                updatedAt: true,
                isActive: true,
            }
        });
        // Convertir fechas a Hermosillo
        const usersWithLocalTime = users.map(u => ({
            ...u,
            createdAt: toHermosillo(u.createdAt),
            updatedAt: toHermosillo(u.updatedAt)
        }));
        res.status(200).json(usersWithLocalTime);
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
                userType: {
                    select: {
                        name: true
                    }
                },
                createdAt: true,
                updatedAt: true,
                isActive: true
            }
        });
        if (user && user.email) {
            user.email = decrypt(user.email);
        }
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Convertir fechas a Hermosillo
        user.createdAt = toHermosillo(user.createdAt);
        user.updatedAt = toHermosillo(user.updatedAt);
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener usuario por ID:', error);
        return res.status(500).json({ message: 'Error al obtener usuario' });
    }
}

export const updateEmail = async (req, res) => {
    const { id } = req.params;
    const userId = parseInt(id, 10);
    const currentUserId = req.user?.id;
    if (!id || isNaN(userId) || userId <= 0) {
        return res.status(400).json({ message: 'ID de usuario inválido' });
    }
    const parse = updateEmailSchema.safeParse(req.body);
    if (!parse.success) {
        return res.status(400).json({ errors: parse.error.flatten().fieldErrors });
    }
    const { email } = parse.data;
    try {
        // Verificar si el email ya es igual al actual
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('Usuario no encontrado');
        const encryptedEmail = deterministicEncrypt(email);
        if (user.email === encryptedEmail) {
            return res.status(200).json({ message: 'El email ya es el mismo que el actual.' });
        }
        const result = await prisma.$transaction(async (tx) => {
            const existingEmailUser = await tx.user.findFirst({ where: { email: encryptedEmail, id: { not: userId } } });
            if (existingEmailUser) throw new Error('El email ya está en uso por otro usuario');
            const updatedUser = await tx.user.update({ where: { id: userId }, data: { email: encryptedEmail } });
            return updatedUser;
        });
        // Si el usuario edita su propio email, hacer logout
        let logout = false;
        if (currentUserId === userId) {
            logout = true;
        }
        return res.status(200).json({
            id: result.id,
            username: result.username,
            name: result.name,
            lastName: result.lastName,
            secondLastName: result.secondLastName,
            email: decrypt(result.email),
            createdAt: toHermosillo(result.createdAt),
            updatedAt: toHermosillo(result.updatedAt),
            isActive: result.isActive,
            ...(logout ? { logout: true } : {})
        });
    } catch (error) {
        return res.status(400).json({ message: error.message || 'Error al actualizar email' });
    }
};

export const updateUsername = async (req, res) => {
    const { id } = req.params;
    const userId = parseInt(id, 10);
    const currentUserId = req.user?.id;
    if (!id || isNaN(userId) || userId <= 0) {
        return res.status(400).json({ message: 'ID de usuario inválido' });
    }
    const parse = updateUsernameSchema.safeParse(req.body);
    if (!parse.success) {
        return res.status(400).json({ errors: parse.error.flatten().fieldErrors });
    }
    const { username } = parse.data;
    try {
        // Verificar si el username ya es igual al actual
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('Usuario no encontrado');
        if (user.username === username) {
            return res.status(200).json({ message: 'El nombre de usuario ya es el mismo que el actual.' });
        }
        const result = await prisma.$transaction(async (tx) => {
            const existingUser = await tx.user.findUnique({ where: { username } });
            if (existingUser && existingUser.id !== userId) throw new Error('El nombre de usuario ya está en uso');
            const updatedUser = await tx.user.update({ where: { id: userId }, data: { username } });
            return updatedUser;
        });
        // Si el usuario edita su propio username, hacer logout
        let logout = false;
        if (currentUserId === userId) {
            logout = true;
        }
        return res.status(200).json({
            id: result.id,
            username: result.username,
            name: result.name,
            lastName: result.lastName,
            secondLastName: result.secondLastName,
            email: decrypt(result.email),
            createdAt: toHermosillo(result.createdAt),
            updatedAt: toHermosillo(result.updatedAt),
            isActive: result.isActive,
            ...(logout ? { logout: true } : {})
        });
    } catch (error) {
        return res.status(400).json({ message: error.message || 'Error al actualizar username' });
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
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('Usuario no encontrado');
        const normalize = v => (v ?? '').toString().trim().toLowerCase();
        let allEqual = true;
        if (name !== undefined && normalize(user.name) !== normalize(name)) allEqual = false;
        if (lastName !== undefined && normalize(user.lastName) !== normalize(lastName)) allEqual = false;
        if (secondLastName !== undefined && normalize(user.secondLastName) !== normalize(secondLastName)) allEqual = false;
        if (allEqual) {
            return res.status(200).json({ message: 'El nombre completo ya es el mismo que el actual.' });
        }
        // Solo actualizar los campos enviados
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (secondLastName !== undefined) updateData.secondLastName = secondLastName;
        const result = await prisma.$transaction(async (tx) => {
            const updatedUser = await tx.user.update({ where: { id: userId }, data: updateData });
            return updatedUser;
        });
        return res.status(200).json({
            id: result.id,
            username: result.username,
            name: result.name,
            lastName: result.lastName,
            secondLastName: result.secondLastName,
            email: decrypt(result.email),
            createdAt: toHermosillo(result.createdAt),
            updatedAt: toHermosillo(result.updatedAt),
            isActive: result.isActive
        });
    } catch (error) {
        return res.status(400).json({ message: error.message || 'Error al actualizar nombre completo' });
    }
};

export const updatePassword = async (req, res) => {
    const { id } = req.params;
    const userId = parseInt(id, 10);
    const currentUserId = req.user?.id;
    if (!id || isNaN(userId) || userId <= 0) {
        return res.status(400).json({ message: 'ID de usuario inválido' });
    }
    const parse = updatePasswordSchema.safeParse(req.body);
    if (!parse.success) {
        return res.status(400).json({ errors: parse.error.flatten().fieldErrors });
    }
    const { newPassword } = parse.data;
    try {
        // Ya no se verifica si la contraseña es igual a la anterior
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('Usuario no encontrado');
        const result = await prisma.$transaction(async (tx) => {
            const hashedPassword = await hashPassword(newPassword);
            const updatedUser = await tx.user.update({ where: { id: userId }, data: { password: hashedPassword } });
            return updatedUser;
        });
        // Si el usuario edita su propio password, hacer logout
        let logout = false;
        if (currentUserId === userId) {
            logout = true;
        }
        return res.status(200).json({
            id: result.id,
            username: result.username,
            name: result.name,
            lastName: result.lastName,
            secondLastName: result.secondLastName,
            email: decrypt(result.email),
            createdAt: toHermosillo(result.createdAt),
            updatedAt: toHermosillo(result.updatedAt),
            isActive: result.isActive,
            ...(logout ? { logout: true } : {})
        });
    } catch (error) {
        return res.status(400).json({ message: error.message || 'Error al actualizar contraseña' });
    }
};

export const disabledEnabledUser = async (req, res) => {
    const { id } = req.params;
    const userId = parseInt(id, 10);
    const currentUserId = req.user?.id;
    if (!id || isNaN(userId) || userId <= 0) {
        return res.status(400).json({ message: 'ID de usuario inválido' });
    }
    // No permitir que un usuario se deshabilite a sí mismo
    if (currentUserId === userId) {
        return res.status(403).json({ message: 'No puedes deshabilitar tu propia cuenta.' });
    }
    const parse = disabledEnabledUserSchema.safeParse(req.body);
    if (!parse.success) {
        return res.status(400).json({ errors: parse.error.flatten().fieldErrors });
    }
    const { isEnabled } = parse.data;
    try {
        // Verificar si el estado ya es igual al actual
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('Usuario no encontrado');
        if (user.isActive === isEnabled) {
            return res.status(200).json({ message: 'El estado ya es el mismo que el actual.' });
        }
        const result = await prisma.$transaction(async (tx) => {
            const updatedUser = await tx.user.update({ where: { id: userId }, data: { isActive: isEnabled } });
            return updatedUser;
        });
        return res.status(200).json({
            id: result.id,
            username: result.username,
            name: result.name,
            lastName: result.lastName,
            secondLastName: result.secondLastName,
            email: decrypt(result.email),
            isActive: result.isActive,
            createdAt: toHermosillo(result.createdAt),
            updatedAt: toHermosillo(result.updatedAt),
            isActive: result.isActive
        });
    } catch (error) {
        return res.status(400).json({ message: error.message || 'Error al actualizar estado del usuario' });
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

