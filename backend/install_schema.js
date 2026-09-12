import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : 'root';
const DB_NAME = process.env.DB_NAME || 'finanzas_db';

async function run() {
  try {
    console.log(`Conectando a MySQL (${DB_USER}@${DB_HOST}:${DB_PORT})...`);
    const conn = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASS,
      multipleStatements: true
    });
    console.log('Conexion exitosa a MySQL.');

    const sqlPath = path.join(__dirname, 'schema_completo.sql');
    console.log(`Leyendo esquema desde: ${sqlPath}`);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Ejecutando schema_completo.sql...');
    await conn.query(sql);

    console.log('Base de datos y tablas creadas exitosamente.');
    const [tables] = await conn.query(`USE \`${DB_NAME}\`; SHOW FULL TABLES;`);
    console.log('Tablas en ' + DB_NAME + ':');
    console.table(tables);

    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('Error al instalar el esquema:', err.message);
    process.exit(1);
  }
}

run();
