// src/routes/index.js
import express from 'express';
import authRoutes from './authRoutes.js'
import adminRoutes from './adminRoutes.js'
import postRoutes from './postRoutes.js'
import userRoutes from './userRoutes.js'
import translateRoutes from './translateRoutes.js'

const router = express.Router();
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes); 
router.use('/posts', postRoutes);
router.use('/', userRoutes); // 댓글 관련
router.use('/translate', translateRoutes);

export default router;