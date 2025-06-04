export const secretKey = process.env.JWT_SECRET || 'S#3$3cR3tK3y';
export const algorithm = process.env.JWT_ALGORITHM || 'HS256';
export const expirationTime = process.env.JWT_EXPIRATION_TIME || '1d'; // 1 día por defecto