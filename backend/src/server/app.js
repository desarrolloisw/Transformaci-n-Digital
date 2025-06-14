import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';
import authRoutes from '../routes/auth.routes.js';
import processRoutes from '../routes/chatbot-config/process.routes.js';
import staticChatbotRoutes from '../routes/static-chatbot.routes.js';
import dinamicChatbotRoutes from '../routes/dinamic-chatbot.routes.js';
import userRoutes from '../routes/user.routes.js';
import categoryRoutes from '../routes/chatbot-config/category.routes.js';
import faqRoutes from '../routes/chatbot-config/faq.routes.js';
import dashboardRoutes from '../routes/dashboard/chatbot-dashboard.routes.js';
import { fileURLToPath } from 'url';

// Configuración del servidor Express
const app = express();

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

// Sirve archivos estáticos desde el directorio 'public'
app.use(express.static(path.resolve(import.meta.dirname, '..', '..', 'public')));

// Configurando las rutas de autenticación
app.use('/api/auth', authRoutes);
// Configurando las rutas del chatbot estático
app.use('/api/chatbot', staticChatbotRoutes);
// Configurando las rutas del chatbot dinámico
app.use('/api/chatbot', dinamicChatbotRoutes);
// Configurando las rutas de usuario
app.use('/api/users', userRoutes);
// Configurando las rutas de procesos del chatbot
app.use('/api/processes', processRoutes);
// Configurando las rutas de categorías
app.use('/api/categories', categoryRoutes);
// Configurando las rutas de FAQs
app.use('/api/faqs', faqRoutes);
// Rutas del dashboard de logs de consultas
app.use('/api/dashboard', dashboardRoutes);

// Obtener el nombre del archivo actual
const __filename = fileURLToPath(import.meta.url);

// Obtener el directorio del archivo actual
const __dirname = path.dirname(__filename);

// Configurando la carpeta estática para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurando para que cualquier ruta redirija al archivo HTML principal
app.get(/.*/, (req, res) => {
   return res.sendFile(path.join(path.resolve(), "public", "index.html"));
});

// Exportar la aplicación para su uso en otros módulos
export default app;