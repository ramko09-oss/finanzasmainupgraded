// =============================================================
// init_postgres_db.js — Inicializar schema PostgreSQL en Aiven
// Ejecutar: node init_postgres_db.js
// =============================================================

import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

function getPoolConfig() {
  if (process.env.DATABASE_URL) {
    try {
      const parsed = new URL(process.env.DATABASE_URL);
      return {
        host: parsed.hostname,
        port: parseInt(parsed.port) || 5432,
        user: parsed.username,
        password: decodeURIComponent(parsed.password),
        database: parsed.pathname.replace(/^\//, '') || 'defaultdb',
        ssl: {
          rejectUnauthorized: false
        }
      };
    } catch (e) {
      return {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      };
    }
  }

  return {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'avnadmin',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'defaultdb',
    ssl: { rejectUnauthorized: false }
  };
}

async function initPostgresDB() {
  console.log('🚀 Inicializando base de datos PostgreSQL en la nube (Aiven)...');
  const pool = new Pool(getPoolConfig());

  try {
    const client = await pool.connect();
    console.log('✅ Conexión establecida con el servidor PostgreSQL de Aiven');

    // 1. Tabla usuarios
    await client.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre_usuario VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla "usuarios" creada o verificada');

    // 2. Tabla transacciones
    await client.query(`
      CREATE TABLE IF NOT EXISTS transacciones (
        id SERIAL PRIMARY KEY,
        usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('Ingreso', 'Gasto')),
        monto NUMERIC(10, 2) NOT NULL,
        descripcion VARCHAR(255) NOT NULL,
        fecha DATE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla "transacciones" creada o verificada');

    // 3. Índices de optimización
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_transacciones_usuario ON transacciones(usuario_id);
      CREATE INDEX IF NOT EXISTS idx_transacciones_fecha ON transacciones(fecha);
    `);
    console.log('✅ Índices de optimización creados');

    client.release();
    await pool.end();
    console.log('🎉 ¡Base de datos PostgreSQL inicializada exitosamente en Aiven!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error inicializando PostgreSQL:', error.message);
    await pool.end();
    process.exit(1);
  }
}

initPostgresDB();
