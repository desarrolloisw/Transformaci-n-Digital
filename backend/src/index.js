/**
 * Main entry point for the backend server.
 *
 * Imports the Express app and starts the server on the specified port.
 */
import app from './server/app.js';
import { PORT } from './config/server.config.js';

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});