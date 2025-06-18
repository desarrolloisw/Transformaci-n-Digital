/**
 * Backend API base URL for the frontend application.
 *
 * Reads from VITE_BACKEND_URL environment variable if set, otherwise defaults to 'http://localhost:3000'.
 * This value is used for all API requests from the frontend to the backend server.
 */
export const ENV_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';