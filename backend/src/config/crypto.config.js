import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-encryption-key';
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // Para AES, el IV debe ser de 16 bytes

const encrypt = (text) => {
    try {
        // Crear un IV aleatorio
        const iv = crypto.randomBytes(IV_LENGTH);

        // Crear el cipher con la clave de cifrado y el IV
        const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);

        // Encriptar el texto
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // Retornar el IV y el texto encriptado concatenados
        return iv.toString('hex') + ':' + encrypted;
    }catch (error) {
        console.error('Error al encriptar:', error);
        throw new Error('Error al encriptar el texto');
    }
}

const decrypt = (encryptedText) => {
    try {
        // Separar el IV y el texto encriptado
        const [ivHex, encrypted] = encryptedText.split(':');
        if (!ivHex || !encrypted) {
            throw new Error('Texto encriptado inválido');
        }

        // Convertir el IV de hexadecimal a un buffer
        const iv = Buffer.from(ivHex, 'hex');
        const encryptedBuffer = Buffer.from(encrypted, 'hex');

        // Crear el decipher con la clave de cifrado y el IV
        const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);

        // Desencriptar el texto
        let decrypted = decipher.update(encryptedBuffer, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        console.error('Error al desencriptar:', error);
        throw new Error('Error al desencriptar el texto');
    }
}

export { encrypt, decrypt, ENCRYPTION_KEY };