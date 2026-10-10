import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';

dotenv.config();

const app = express();

// Rutas a los directorios del proyecto
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
const REACT_DIR = path.join(__dirname, '..', 'sidan-frontend', 'dist');

// ── Trust proxy (Render, Railway, etc. usan proxy inverso) ──
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.json());

// ── Servir Módulo React (Sesión 06) en /react ───────────────
app.use('/react', express.static(REACT_DIR));
app.get('/react*', (req, res) => {
  res.sendFile(path.join(REACT_DIR, 'index.html'));
});

// ── Servir el frontend original como archivos estáticos ─────
app.use(express.static(FRONTEND_DIR));

// ── Rutas de la API ─────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API Finanzas corriendo', environment: process.env.NODE_ENV || 'development' });
});

// Fallback: cualquier ruta que no sea /api → sirve index.html original
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📂 Sistema Principal: http://localhost:${PORT}/`);
  console.log(`⚛️ Módulo React (Sesión 06): http://localhost:${PORT}/react/`);
  console.log(`🌐 Entorno: ${process.env.NODE_ENV || 'development'}`);
});
