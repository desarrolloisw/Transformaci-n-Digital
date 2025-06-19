/**
 * Express application setup
 *
 * This file configures the Express backend server, including middleware, static file serving, and API routes.
 *
 * Features:
 * - Sets up logging, CORS, cookie parsing, and body parsing middleware
 * - Serves static files from the public directory
 * - Registers all API routes for authentication, chatbot, users, categories, FAQs, and dashboard
 * - Serves the frontend app for all unmatched routes
 *
 * Exports:
 *   - app: The configured Express application instance
 */

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
import dinamicChatbotAiRoutes from '../routes/dinamic-chatbot-ai.routes.js';
import { fileURLToPath } from 'url';

const app = express();

// HTTP request logging middleware
app.use(morgan('dev'));

// Cookie parsing middleware
app.use(cookieParser());

// CORS configuration to allow all origins and credentials
const corsOptions = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionSucessStatus: 200
};
app.use(cors(corsOptions));

// Parse incoming JSON requests
app.use(bodyParser.json());
// Parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory (for assets, images, etc.)
app.use(express.static(path.resolve(import.meta.dirname, '..', '..', 'public')));

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/chatbot', staticChatbotRoutes);
app.use('/api/chatbot', dinamicChatbotRoutes);
app.use('/api/chatbot', dinamicChatbotAiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/processes', processRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Get current file and directory name (for static file serving)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the public directory (for frontend build)
app.use(express.static(path.join(__dirname, 'public')));

// Fallback route: serve frontend index.html for all unmatched routes
app.get(/.*/, (req, res) => {
   return res.sendFile(path.join(path.resolve(), "public", "index.html"));
});

export default app;