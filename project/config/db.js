// src/config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import config from './config.js'

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'mydb2',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;