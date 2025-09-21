// src/controllers/authController.js

import * as authService from '../services/authService.js'
import * as UserModel from '../models/User.js'

export async function register(req, res, next) {
    try {
        const { username, password, phone, role } = req.body;
        const user = await authService.register({ username, password, phone, role });
        res.status(201).json({ message: '회원가입 성공', userId: user.id || user.userId || null });
    } catch (err) {
        next(err);
    }
}

export async function login(req, res, next) {
    try {
        const { username, password } = req.body;
        const { token, role } = await authService.login({ username, password });
        res.json({ message: '로그인 성공', token, role });
    } catch (err) {
        next(err);
    }
}

// 아이디 찾기 (phone -> username)
export async function findId(req, res, next) {
    try {
        const { phone } = req.body;
        const user = await UserModel.findByPhone(phone);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ username: user.username });
    } catch (err) {
        next(err);
    }
}