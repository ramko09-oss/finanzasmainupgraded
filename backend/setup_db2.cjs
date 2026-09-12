const mysql = require('mysql2/promise');

async function test() {
  try {
    const conn = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: 'root'
    });
    
    // Create DB
    await conn.query('CREATE DATABASE IF NOT EXISTS finanzas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
    console.log('✅ Database created!');
    
    await conn.query('USE finanzas_db;');
    
    // Create usuarios
    await conn.query(`CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      nombre_usuario VARCHAR(100) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
    console.log('✅ Table usuarios created!');
    
    // Create transacciones
    await conn.query(`CREATE TABLE IF NOT EXISTS transacciones (
      id INT AUTO_INCREMENT PRIMARY KEY,
      usuario_id INT NOT NULL,
      tipo ENUM('Ingreso', 'Gasto') NOT NULL,
      monto DECIMAL(15, 4) NOT NULL,
      descripcion VARCHAR(500) NOT NULL,
      fecha DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    );`);
    console.log('✅ Table transacciones created!');
    
    await conn.end();
  } catch (e) {
    console.error('❌ Failed:', e.message);
  }
}

test();
