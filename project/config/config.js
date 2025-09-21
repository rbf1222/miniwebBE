// src/config/config.js
export default {
    PORT: process.env.PORT || 5000,
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || 3306,
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'ship_db',
    JWT_SECRET: process.env.JWT_SECRET || 'change_this_secret',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d'
};