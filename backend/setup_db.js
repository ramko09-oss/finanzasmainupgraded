import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

async function setupDatabase() {
  try {
    console.log('Conectando a MySQL para crear la base de datos...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : 'root',
      port: process.env.DB_PORT || 3306
    });

    console.log(`Conexión exitosa a MySQL en ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}`);
    
    const dbName = process.env.DB_NAME || 'finanzas_db';
    console.log(`Creando base de datos: ${dbName}...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(`Base de datos ${dbName} creada o ya existía.`);

    console.log(`Usando base de datos ${dbName}...`);
    await connection.query(`USE \`${dbName}\`;`);

    console.log('Leyendo schema.sql...');
    const schemaSql = await fs.readFile('./schema.sql', 'utf8');
    
    // Ejecutar cada comando de esquema individualmente
    const statements = schemaSql.split(';').map(s => s.trim()).filter(s => s.length > 0);
    
    console.log(`Ejecutando ${statements.length} comandos del esquema...`);
    for (const statement of statements) {
      if (!statement.startsWith('--')) {
        await connection.query(statement);
      }
    }
    
    console.log('✅ Esquema y tablas creadas exitosamente.');
    await connection.end();
  } catch (error) {
    console.error('❌ Error configurando la base de datos:');
    console.error(error.message);
    process.exit(1);
  }
}

setupDatabase();
