// Servidor de comprobación local: datos ficticios, sin conexión a la base de datos.
import express from '../backend/node_modules/express/index.js';
import { fileURLToPath } from 'node:url';
const app = express();
let mode = 'normal';
const rows = [
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
app.get('/api/transactions', (req, res) => res.json(mode === 'empty' ? [] : rows));
app.use('/react', express.static(fileURLToPath(new URL('../sidan-frontend/dist', import.meta.url))));
app.use(express.static(fileURLToPath(new URL('../frontend', import.meta.url))));
app.listen(3002, '127.0.0.1', () => console.log('Comprobación local en http://127.0.0.1:3002 (sin acceso a datos reales)'));
