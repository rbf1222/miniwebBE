// src/routes/userRoutes.js
import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import * as userController from '../controllers/userController.js'

import { body } from "express-validator";
import { validate } from "../middlewares/validate.js";

const router = express.Router();
router.post('/posts/:id/comments', authenticate, userController.createComment);
router.put('/comments/:id', authenticate, userController.updateComment);
router.delete('/comments/:id', userController.deleteComment);

// 비밀번호 변경 router
router.put(
    "/users/password",
    authenticate,
    body("newPassword")
        .isString()
        .isLength({ min: 8 })
        .withMessage("새 비밀번호는 최소 8자 이상이어야 합니다."),
    validate,
    userController.changePassword
);

export default router;