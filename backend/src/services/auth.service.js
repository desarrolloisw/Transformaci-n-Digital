import { prisma } from "../libs/prisma.lib.js";
import { hashPassword, comparePassword } from "../config/bcrypt.config.js";
import { encrypt, decrypt, deterministicEncrypt } from "../config/crypto.config.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { generateToken } from "../libs/jwt.lib.js";

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

            // Usar los valores transformados por el schema
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

export async function loginUserService({ identifier, password }) {
    try {
        
        console.log("Datos de login:", { identifier, password });
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
