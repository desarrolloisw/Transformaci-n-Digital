import { prisma } from "../libs/prisma.lib.js";
import { hashPassword, comparePassword } from "../config/bcrypt.config.js";
import { encrypt, decrypt } from "../config/crypto.config.js";
import { registerSchema } from "../schemas/auth.schema.js";
import { generateToken } from "../libs/jwt.lib.js";

export async function registerUserService(userData) {
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

        // Convertir email y username a minúsculas
        parsedData.username = parsedData.username.toLowerCase();
        parsedData.email = parsedData.email.toLowerCase();

        const encryptedEmail = encrypt(parsedData.email);
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
}

export async function loginUserService({ identifier, password }) {
    try{
        if (!identifier || !password) {
            throw new Error("El identificador y la contraseña son obligatorios.");
        }
        // Convertir el identificador a minúsculas
        identifier = identifier.toLowerCase();
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: encrypt(identifier) },
                    { username: identifier.toLowerCase() }
                ]
            }
        });

        if (!user) {
            throw new Error("Usuario no encontrado.");
        }


    if(!user.isActive) {
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
    }catch (error) {
        throw new Error(`Error al encontrar el usuario: ${error.message}`);
    }
}
