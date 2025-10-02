// src/services/authService.js

import * as User from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { signToken } from '../utils/jwt.js';

export async function register({ username, password, phone, role }) {
    const existing = await User.findByUsername(username);
    if (existing) {
        const err = new Error('Username already exists');
        err.status = 400;
        throw err;
    }

    const existingByPhone = await User.findByPhone(phone);
    if (existingByPhone) {
        const err = new Error("Phone already exists");
        err.status = 400;
        throw err;
    }
    const passwordHash = await hashPassword(password);
    const user = await User.createUser({ username, passwordHash, phone, role });
    return user;
}

export async function login({ username, password }) {
    const user = await User.findByUsername(username);
    if (!user) {
        const err = new Error('Invalid username or password');
        err.status = 401;
        throw err;
    }
    const ok = await comparePassword(password, user.password_hash);
    if (!ok) {
        const err = new Error('Invalid username or password');
        err.status = 401;
        throw err;
    }
    const payload = { id: user.id, username: user.username, role: user.role };
    const token = signToken(payload);
    return { token, role: user.role, user: payload };
}