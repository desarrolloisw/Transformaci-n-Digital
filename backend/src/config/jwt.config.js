export const secretKey = process.env.JWT_SECRET || 'S#3$3cR3tK3y';
export const algorithm = process.env.JWT_ALGORITHM || 'HS256';
export const expirationTime = process.env.JWT