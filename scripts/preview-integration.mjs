// Servidor de comprobación local: datos ficticios, sin conexión a la base de datos.
import express from '../backend/node_modules/express/index.js';
import { fileURLToPath } from 'node:url';
import { serveFrontend } from '../backend/frontend.js';
const app = express();
let mode = 'normal';
let rows = [
  { id: 1, tipo: 'Ingreso', monto: '1000.00', descripcion: 'Ingreso de prueba', fecha: '2026-10-01' },
  { id: 2, tipo: 'Gasto', monto: '250.00', descripcion: 'Gasto de prueba', fecha: '2026-10-02' },
];
app.use(express.json());
app.get('/test/:mode', (req, res) => { mode = req.params.mode; res.json({ mode }); });
app.post('/api/auth/login', (req, res) => { mode = 'normal'; res.json({ token: 'local-test-only', user: { id: 1, username: 'Usuario de prueba' } }); });
app.get('/api/auth/me', (req, res) => {
  if (mode === 'expired') return res.status(401).json({ error: 'Sesión expirada' });
  if (mode === 'error') return res.status(503).json({ error: 'Error de conexión de prueba' });
  res.json({ user: { id: 1, username: 'Usuario de prueba' } });
});
app.get('/api/transactions', (req, res) => {
  if (mode === 'expired') return res.status(401).json({ error: 'Sesión expirada' });
  if (mode === 'error') return res.status(503).json({ error: 'Error de conexión de prueba' });
  res.json(mode === 'empty' ? [] : rows);
});
app.post('/api/auth/register', (req, res) => res.status(201).json({ message: 'Cuenta creada' }));
app.post('/api/transactions', (req, res) => {
  const id = Math.max(0, ...rows.map(row => row.id)) + 1;
  rows.unshift({ id, ...req.body }); res.status(201).json({ id });
});
app.delete('/api/transactions/:id', (req, res) => { rows = rows.filter(row => row.id !== Number(req.params.id)); res.json({ message: 'Eliminada' }); });
serveFrontend(app, fileURLToPath(new URL('../sidan-frontend/dist', import.meta.url)));
app.listen(3002, '127.0.0.1', () => console.log('Comprobación local en http://127.0.0.1:3002 (sin acceso a datos reales)'));
