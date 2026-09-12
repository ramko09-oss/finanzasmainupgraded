import dotenv from 'dotenv';

dotenv.config();

// ── Detección de motor: PostgreSQL o MySQL ──
const isPostgres = 
  Boolean(process.env.DATABASE_URL && (process.env.DATABASE_URL.startsWith('postgres://') || process.env.DATABASE_URL.startsWith('postgresql://'))) ||
  Boolean(process.env.DB_TYPE && (process.env.DB_TYPE.toLowerCase() === 'postgres' || process.env.DB_TYPE.toLowerCase() === 'postgresql'));

let db;

if (isPostgres) {
  const { default: pkg } = await import('pg');
  const { Pool } = pkg;

  let poolConfig = {};
  if (process.env.DATABASE_URL) {
    try {
      const parsed = new URL(process.env.DATABASE_URL);
      poolConfig = {
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
      poolConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      };
    }
  } else {
    poolConfig = {
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'avnadmin',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'defaultdb',
      ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false }
    };
  }

  const pool = new Pool(poolConfig);

  // Wrapper de compatibilidad con interfaz mysql2: db.execute(sql, params) -> [rows, fields]
  db = {
    async execute(query, params = []) {
      let pgQuery = query;
      // Convertir DATE_FORMAT a TO_CHAR para fechas
      pgQuery = pgQuery.replace(/DATE_FORMAT\s*\(\s*(\w+)\s*,\s*["']%Y-%m-%d["']\s*\)/gi, "TO_CHAR($1, 'YYYY-MM-DD')");
      
      // Convertir placeholders ? a $1, $2, ...
      let paramIndex = 1;
      pgQuery = pgQuery.replace(/\?/g, () => `$${paramIndex++}`);

      // Si es INSERT y no tiene RETURNING, añadir RETURNING id para obtener insertId
      const isInsert = /^\s*INSERT\s+INTO/i.test(pgQuery);
      if (isInsert && !/RETURNING/i.test(pgQuery)) {
        pgQuery += ' RETURNING id';
      }

      const res = await pool.query(pgQuery, params);

      if (isInsert) {
        const insertId = res.rows.length > 0 && res.rows[0].id ? res.rows[0].id : null;
        return [{ insertId, affectedRows: res.rowCount }, res.fields];
      }

      if (/^\s*(UPDATE|DELETE)/i.test(pgQuery)) {
        return [{ affectedRows: res.rowCount }, res.fields];
      }

      return [res.rows, res.fields];
    },
    async query(query, params = []) {
      return this.execute(query, params);
    },
    async getConnection() {
      const client = await pool.connect();
      return {
        release: () => client.release()
      };
    },
    pool
  };

  pool.connect()
    .then(client => {
      console.log('✅ Conectado a la base de datos PostgreSQL (Aiven/Cloud)');
      console.log(`   Host: ${poolConfig.host || 'Cloud'} | DB: ${poolConfig.database || 'defaultdb'}`);
      client.release();
    })
    .catch(err => {
      console.error('❌ Error conectando a PostgreSQL:', err.message);
    });

} else {
  // Motor MySQL (para entorno local o MySQL en nube)
  const { default: mysql } = await import('mysql2/promise');

  function getPoolConfig() {
    if (process.env.DATABASE_URL) {
      const url = new URL(process.env.DATABASE_URL);
      return {
        host: url.hostname,
        port: parseInt(url.port) || 3306,
        user: url.username,
        password: url.password,
        database: url.pathname.replace('/', '') || process.env.DB_NAME || 'finanzas_db',
        ssl: { rejectUnauthorized: false },
        waitForConnections: true,
        connectionLimit: 5,
        queueLimit: 0
      };
    }

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

    if (process.env.DB_SSL === 'true') {
      config.ssl = { rejectUnauthorized: false };
    }

    return config;
  }

  const pool = mysql.createPool(getPoolConfig());

  db = pool;

  pool.getConnection()
    .then(connection => {
      console.log('✅ Conectado a la base de datos MySQL');
      const cfg = getPoolConfig();
      console.log(`   Host: ${cfg.host}:${cfg.port} | DB: ${cfg.database}`);
      connection.release();
    })
    .catch(err => {
      console.error('❌ Error conectando a MySQL:', err.message);
    });
}

export default db;
