import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// ── Parsear DATABASE_URL (formato: mysql://user:pass@host:port/dbname) ──
function getPoolConfig() {
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    return {
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.replace('/', '') || process.env.DB_NAME || 'finanzas_db',
      ssl: { rejectUnauthorized: true },
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0
    };
  }

  // ── Variables individuales (local o Render con vars separadas) ──
  const config = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : 'root',
    database: process.env.DB_NAME || 'finanzas_db',
    port: parseInt(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };

  // Activar SSL para proveedores cloud (Aiven, PlanetScale, etc.)
  if (process.env.DB_SSL === 'true') {
    config.ssl = { rejectUnauthorized: true };
  }

  return config;
}

const db = mysql.createPool(getPoolConfig());

// Probar conexión
db.getConnection()
  .then(connection => {
    console.log('✅ Conectado a la base de datos MySQL');
    const cfg = getPoolConfig();
    console.log(`   Host: ${cfg.host}:${cfg.port} | DB: ${cfg.database}`);
    connection.release();
  })
  .catch(err => {
    console.error('❌ Error conectando a MySQL:', err.message);
    console.error('Por favor verifica tus credenciales en el archivo .env o asegúrate de que MySQL esté corriendo.');
  });

export default db;
