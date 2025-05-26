//npm install pg
const { Pool } = require('pg');

// Create a new connection pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost', 
    database: 'setap_cw',
    password: 'bisola1967',// each persons personal posgress password
    port: 5432, // Default PostgreSQL port
});

module.exports = { pool };
