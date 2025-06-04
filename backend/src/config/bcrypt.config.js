import bcrypt from 'bcrypt';

const saltRounds = 10;

const hashPassword = async (password) => {
    if (!password) throw new Error('Contraseña es requerida.');
    try {
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        console.error('Error hasheando la contraseña:', error);
        throw error;
    }
};

const comparePassword = async (password, storedPassword) => {
    if (!password || !storedPassword) return false;
    try {
        return await bcrypt.compare(password, storedPassword);
    } catch (error) {
        console.error('Error comparando contraseñas:', error);
        throw error;
    }
};

export { hashPassword, comparePassword };