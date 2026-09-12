// =============================================================
// init_cloud_db.js — Inicializar schema en la BD de la nube
// Ejecutar una sola vez: node init_cloud_db.js
// =============================================================

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// ── Parsear DATABASE_URL o usar variables individuales ──────
function getConnectionConfig() {
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    return {
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: url.username,
      password: url.password,
      // No especificamos database aquí, la creamos luego
      ssl: { rejectUnauthorized: true }
    };
  }

  const config = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : 'root',
  };

  // Activar SSL si lo requiere el proveedor cloud
  if (process.env.DB_SSL === 'true') {
    config.ssl = { rejectUnauthorized: true };
  }

  return config;
}

const DB_NAME = process.env.DB_NAME || 'finanzas_db';

async function initCloudDB() {
  console.log('🚀 Inicializando base de datos en la nube...');
  console.log(`   Host: ${getConnectionConfig().host}`);
  console.log(`   Puerto: ${getConnectionConfig().port}`);

  let connection;
  try {
    // 1. Conectar sin especificar base de datos
    connection = await mysql.createConnection(getConnectionConfig());
    console.log('✅ Conectado al servidor MySQL');

    // 2. Crear base de datos
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`✅ Base de datos '${DB_NAME}' verificada/creada`);

    // 3. Usar la base de datos
    await connection.changeUser({ database: DB_NAME });

    // 4. Crear tabla de usuarios
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id             INT          AUTO_INCREMENT PRIMARY KEY,
        email          VARCHAR(255) NOT NULL UNIQUE COMMENT 'Email unico del usuario',
        nombre_usuario VARCHAR(100) NOT NULL        COMMENT 'Nombre de usuario en la app',
        password_hash  VARCHAR(255) NOT NULL        COMMENT 'Hash bcrypt de la contrasena',
        created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de registro'
      ) ENGINE=InnoDB
        DEFAULT CHARSET=utf8mb4
        COLLATE=utf8mb4_unicode_ci
        COMMENT='Tabla de usuarios registrados'
    `);
    console.log('✅ Tabla "usuarios" verificada/creada');

    // 5. Crear tabla de transacciones
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS transacciones (
        id          INT              AUTO_INCREMENT PRIMARY KEY,
        usuario_id  INT              NOT NULL COMMENT 'FK: usuario dueno del movimiento',
        tipo        ENUM('Ingreso', 'Gasto') NOT NULL COMMENT 'Tipo de movimiento',
        monto       DECIMAL(15, 4)   NOT NULL COMMENT 'Monto en USD',
        descripcion VARCHAR(500)     NOT NULL COMMENT 'Descripcion del movimiento',
        fecha       DATE             NOT NULL COMMENT 'Fecha (YYYY-MM-DD)',
        created_at  TIMESTAMP        DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creacion',
        CONSTRAINT fk_transacciones_usuario
          FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        INDEX idx_transacciones_fecha (fecha),
        INDEX idx_transacciones_usuario_fecha (usuario_id, fecha),
        INDEX idx_transacciones_tipo (usuario_id, tipo)
      ) ENGINE=InnoDB
        DEFAULT CHARSET=utf8mb4
        COLLATE=utf8mb4_unicode_ci
        COMMENT='Tabla de movimientos financieros (ingresos y gastos)'
    `);
    console.log('✅ Tabla "transacciones" verificada/creada');

    // 6. Verificar
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('\n📋 Tablas en la base de datos:');
    tables.forEach(t => {
      const name = Object.values(t)[0];
      console.log(`   • ${name}`);
    });

    console.log('\n🎉 ¡Base de datos inicializada correctamente!');
    console.log('   Ya puedes desplegar tu aplicación.');

  } catch (error) {
    console.error('\n❌ Error inicializando la base de datos:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   → Verifica que el host y puerto son correctos.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   → Verifica usuario y contraseña.');
    }
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

initCloudDB();
