-- ==============================================
-- SCHEMA COMPLETO: Sistema de Gestion Financiera
-- Base de datos: finanzas_db
-- Motor: MySQL 8.0+
-- ==============================================

-- 1. Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS finanzas_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE finanzas_db;

-- 2. Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id             INT          AUTO_INCREMENT PRIMARY KEY,
  email          VARCHAR(255) NOT NULL UNIQUE COMMENT 'Email unico del usuario',
  nombre_usuario VARCHAR(100) NOT NULL        COMMENT 'Nombre de usuario en la app',
  password_hash  VARCHAR(255) NOT NULL        COMMENT 'Hash bcrypt de la contrasena',
  created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de registro'
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Tabla de usuarios registrados';

-- 3. Tabla de transacciones (con indices integrados)
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
  COMMENT='Tabla de movimientos financieros (ingresos y gastos)';

-- 4. Verificacion final
SELECT 'Base de datos finanzas_db configurada correctamente.' AS Estado;
SHOW FULL TABLES;
