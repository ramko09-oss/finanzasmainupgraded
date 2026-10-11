import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
import { serveFrontend } from './frontend.js';

dotenv.config();

const app = express();

// Rutas a los directorios del proyecto
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REACT_DIR = path.join(__dirname, '..', 'sidan-frontend', 'dist');

// ── Trust proxy (Render, Railway, etc. usan proxy inverso) ──
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.json());

// ── Rutas de la API ─────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API Finanzas corriendo', environment: process.env.NODE_ENV || 'development' });
});

serveFrontend(app, REACT_DIR);

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📂 Sistema Principal: http://localhost:${PORT}/`);
  console.log(`🌐 Entorno: ${process.env.NODE_ENV || 'development'}`);
});
