import bcrypt from "bcrypt";
import * as User from "../models/User.js";
import { hashPassword } from '../utils/hash.js';

const SALT_ROUNDS = 10;

export async function changePassword(userId, newPassword) {
    const user = await User.findById(userId);
    if (!user) {
        const err = new Error("사용자를 찾을 수 없습니다.");
        err.status = 404;
        throw err;
    }

    // 새 비밀번호 해시 후 업데이트
    const newHash = await hashPassword(newPassword);
    await User.updatePassword(userId, newHash);
}