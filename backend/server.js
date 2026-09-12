import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';

dotenv.config();

const app = express();

// Ruta al directorio raíz del proyecto (un nivel arriba de /backend)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

// ── Trust proxy (Render, Railway, etc. usan proxy inverso) ──
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.json());

// ── Servir el frontend como archivos estáticos ──────────────
app.use(express.static(FRONTEND_DIR));

// ── Rutas de la API ─────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API Finanzas corriendo', environment: process.env.NODE_ENV || 'development' });
});

// Fallback: cualquier ruta que no sea /api → sirve index.html
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📂 Frontend servido desde: ${FRONTEND_DIR}`);
  console.log(`🌐 Entorno: ${process.env.NODE_ENV || 'development'}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`🌐 Abre tu navegador en: http://localhost:${PORT}`);
  }
});
