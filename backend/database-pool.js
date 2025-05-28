//npm install pg
const { Pool } = require('pg');

// Create a new connection pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost', 
    database: 'setap_cw',
    password: 'chan1234',
    port: 5432, // Default PostgreSQL port
});

module.exports = { pool };
