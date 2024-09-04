const pgp = require('pg-promise');
require('dotenv').config();

const db = pgp({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

module.exports = db;
