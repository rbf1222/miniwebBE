// src/routes/postRoutes.js
import express from 'express';
import * as postController from '../controllers/postController.js'

const router = express.Router();
router.get('/', postController.list);
router.get('/:id', postController.detail);
// router.post('/', postController.createAndSendSMS);

export default router;  