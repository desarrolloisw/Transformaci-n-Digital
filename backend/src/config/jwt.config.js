export const jwtConfig = {
    secretKey: process.env.JWT_SECRET_KEY || 'S#3$3cR3tK3y',
    algorithm: process.env.JWT_ALGORITHM || 'HS256',
    expirationTime: process.env.JWT_EXPIRATION_TIME || '1440m', // in minutes
}