import Express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';
import authRoutes from './routes/auth.routes.js';

// Configuración del servidor Express
const app = new Express();

// Configurando Morgan para el logging de peticiones HTTP
app.use(morgan('dev'));

// Configurando cookie parser para manejar cookies
app.use(cookieParser());

// Configurando CORS para permitir solicitudes desde cualquier origen
const corsOptions = {
    origin: '*', // Permitir cualquier origen
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionSucessStatus: 200
};

// Middleware para manejar CORS
app.use(cors(corsOptions));

// Configurando body parser para manejar datos JSON y URL-encoded
app.use(bodyParser.json());

// Middleware para manejar datos URL-encoded
app.use(bodyParser.urlencoded({ extended: true }));

// Configurando las rutas de autenticación
app.use('/api/auth', authRoutes);

// Configurando la carpeta estática para servir archivos estáticos
app.use(Express.static(path.join(__dirname, 'public')));

// Configurando para cargar el archivo HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Configurando para que cualquier ruta redirija al archivo HTML principal
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Exportar la aplicación para su uso en otros módulos
export default app;