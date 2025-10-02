// src/models/User.js
import db from '../config/db.js'

export async function createUser({ username, passwordHash, phone, role = 'user' }) {
    const [result] = await db.query(
        'INSERT INTO users (username, password_hash, phone, role, created_at) VALUES (?, ?, ?, ?, NOW())',
        [username, passwordHash, phone, role]
    );
    return { id: result.insertId, username, phone, role };
}

export async function findByUsername(username) {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
}

export async function findByPhone(phone) {
    const [rows] = await db.query('SELECT * FROM users WHERE phone = ?', [phone]);
    return rows[0];
}

export async function findById(id) {
    const [rows] = await db.query('SELECT id, username, phone, role, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
}

export async function updatePassword(userId, newHash) {
    await db.query(
        "UPDATE users SET password_hash = ? WHERE id = ?",
        [newHash, userId]
    );
}

export async function getSmsReceivableUsers() {
    const [rows] = await db.query(
        `SELECT phone FROM users WHERE role = 'user' AND phone IS NOT NULL`
    );
    return rows;
}