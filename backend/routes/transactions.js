import express from 'express';
import db from '../db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas de transacciones requieren autenticación
router.use(authenticateToken);

// Obtener todas las transacciones del usuario
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Obtener transacciones ordenadas por fecha descendente
    const [transactions] = await db.execute(
      'SELECT id, tipo, monto, descripcion, DATE_FORMAT(fecha, "%Y-%m-%d") as fecha FROM transacciones WHERE usuario_id = ? ORDER BY fecha DESC, created_at DESC',
      [userId]
    );

    res.json(transactions);
  } catch (error) {
    console.error('Error obteniendo transacciones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Agregar una transacción
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { tipo, monto, descripcion, fecha } = req.body;

    if (!tipo || !monto || !descripcion || !fecha) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    if (tipo !== 'Ingreso' && tipo !== 'Gasto') {
      return res.status(400).json({ error: 'Tipo inválido (debe ser Ingreso o Gasto)' });
    }

    const [result] = await db.execute(
      'INSERT INTO transacciones (usuario_id, tipo, monto, descripcion, fecha) VALUES (?, ?, ?, ?, ?)',
      [userId, tipo, parseFloat(monto), descripcion, fecha]
    );

    res.status(201).json({ 
      message: 'Transacción creada', 
      id: result.insertId 
    });
  } catch (error) {
    console.error('Error creando transacción:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar una transacción
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const transactionId = req.params.id;

    // Verificar que la transacción pertenezca al usuario antes de eliminar
    const [result] = await db.execute(
      'DELETE FROM transacciones WHERE id = ? AND usuario_id = ?',
      [transactionId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Transacción no encontrada o no autorizada' });
    }

    res.json({ message: 'Transacción eliminada' });
  } catch (error) {
    console.error('Error eliminando transacción:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
