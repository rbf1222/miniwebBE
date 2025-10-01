// src/routes/translateRoutes.js

import express from 'express';
//import { authenticate } from '../middlewares/authMiddleware.js';
import * as translateController from '../controllers/translateController.js';

const router = express.Router();
// authenticate 미들웨어는 필요에 따라 켜고 끌 수 있음 ↓
//router.post('/', authenticate, translateController.translateText); // 원래 코드
router.post('/', translateController.translateText); // 수정됨: 인증 미들웨어 제거
export default router;
