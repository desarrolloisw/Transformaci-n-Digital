import app from './server/app.js';
import { PORT } from './config/server.config.js';

// Iniciar el servidor en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});