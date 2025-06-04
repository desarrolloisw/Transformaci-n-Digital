import bcrypt from 'bcrypt';

const saltRounds = 10;

const hashPassword = async (password) => {
    if (!password) throw new Error('Password is required');
    try {
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
};

const comparePassword = async (password, storedPassword) => {
    if (!password || !storedPassword) return false;
    try {
        return await bcrypt.compare(password, storedPassword);
    } catch (error) {
        console.error('Error comparing password:', error);
        throw error;
    }
};

export { hashPassword, comparePassword };