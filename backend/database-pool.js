//npm install pg
const { Pool } = require('pg');

// Create a new connection pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost', // Or your remote database host
    database: 'setap_cw',
    password: 'TarirO12345',
    port: 5432, // Default PostgreSQL port
});

module.exports = { pool };