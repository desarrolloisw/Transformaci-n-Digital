export const server_enviroments = {
    PORT : process.env.PORT || 3000,
    DATABASE_URL : process.env.DATABASE_URL || 'mysql://root:root@localhost:3306/basededatos',
    JWT_SECRET_KEY : process.env.JWT_SECRET_KEY || 'S#3$3cR3tK3y',
    JWT_ALGORITHM : process.env.JWT_ALGORITHM || 'HS256',
    JWT_EXPIRATION_TIME : process.env.JWT_EXPIRATION_TIME || 1440, // in minutes
    ENCRYPTION_KEY : process.env.ENCRYPTION_KEY || 'e12ec12/12-324c2rxe3tcb5_=$'
}