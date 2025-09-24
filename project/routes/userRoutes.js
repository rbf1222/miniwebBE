// src/routes/userRoutes.js
import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import * as userController from '../controllers/userController.js'

const router = express.Router(); 
router.post('/posts/:id/comments', authenticate, userController.createComment);
router.put('/comments/:id',authenticate, userController.updateComment);
router.delete('/comments/:id', userController.deleteComment);

export default router;