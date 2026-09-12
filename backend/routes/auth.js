import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro_cambiar_en_produccion';

// ─── Registro de Usuario ───────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();

    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Verificar si el email ya existe (insensible a mayúsculas/minúsculas)
    const [existingUsers] = await db.execute('SELECT id FROM usuarios WHERE LOWER(email) = LOWER(?)', [cleanEmail]);
    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insertar usuario
    const [result] = await db.execute(
      'INSERT INTO usuarios (email, nombre_usuario, password_hash) VALUES (?, ?, ?)',
      [cleanEmail, cleanUsername, passwordHash]
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      userId: result.insertId,
      email: cleanEmail
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor al procesar el registro' });
  }
});

// ─── Iniciar Sesión ────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Buscar usuario (insensible a mayúsculas/minúsculas para compatibilidad total)
    const [users] = await db.execute('SELECT * FROM usuarios WHERE LOWER(email) = LOWER(?)', [cleanEmail]);
    if (!users || users.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const user = users[0];

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.nombre_usuario
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor al iniciar sesión' });
  }
});

// ─── Verificar Token y Obtener Usuario Actual ──────────────────────────────
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.execute('SELECT id, email, nombre_usuario FROM usuarios WHERE id = ?', [req.user.id]);
    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const user = users[0];
    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.nombre_usuario
      }
    });
  } catch (error) {
    console.error('Error verificando usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
