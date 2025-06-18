/**
 * Server configuration
 *
 * Provides configuration constants for the server port and database connection URL.
 *
 * Exports:
 *   - PORT: The port number the server listens on (default: 3000)
 *   - DATABASE_URL: The database connection string
 */

export const PORT = process.env.PORT || 3000;
export const DATABASE_URL = process.env.DATABASE_URL || 'mysql://root:root@localhost:3306/basededatos';