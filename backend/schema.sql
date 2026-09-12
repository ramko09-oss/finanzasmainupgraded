-- Crear base de datos (opcional, ejecutar manualmente si es necesario)
-- CREATE DATABASE finanzas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE finanzas_db;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  nombre_usuario VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de transacciones
CREATE TABLE IF NOT EXISTS transacciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo ENUM('Ingreso', 'Gasto') NOT NULL,
  monto DECIMAL(15, 4) NOT NULL,   -- Siempre en USD internamente
  descripcion VARCHAR(500) NOT NULL,
  fecha DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
