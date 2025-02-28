// code for terminal
//npm init -y
//npm install express pg pg-hstore sequelize dotenv


import express from 'express';

const app = express();
app.use(express.json());
const { Sequelize } = require("sequelize");