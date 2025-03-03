// db.js
const { Client } = require('pg');

// Database connection configuration
const client = new Client({
  user: '', // Replace with your PostgreSQL username
  host: '', // Replace with your database host
  database: '', // Replace with your database name
  password: '', // Replace with your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});

// Connect to the database
client.connect()
  .then(() => console.log('Connected to PostgreSQL database'))
  .catch(err => console.error('Connection error', err.stack));

module.exports = client;