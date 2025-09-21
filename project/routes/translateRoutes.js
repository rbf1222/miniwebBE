// src/routes/translateRoutes.js

import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import * as translateController from '../controllers/translateController.js'

const router = express.Router();
router.post('/', authenticate, translateController.translate);

export default router;