// src/routes/adminRoutes.js
import express from 'express';
import * as adminController from '../controllers/adminController.js'
import { authenticate, authorizeRole } from '../middlewares/authMiddleware.js';
import upload from '../config/multer.js';

const router = express.Router();

//authMiddleware : 인증 / 인가 확인  

//api/admin/posts
//upload.single('file') : 단일 파일 업로드 처리
router.post('/posts', authenticate, authorizeRole('admin'), upload.single('file'), adminController.uploadPost);
router.put('/posts/:id', authenticate, authorizeRole('admin'), adminController.updatePost);
router.delete('/posts/:id', authenticate, authorizeRole('admin'), adminController.deletePost);

export default router; 