// src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet'
import morgan from 'morgan'
import routes from './routes/index.js'
import { errorHandler } from './middlewares/errorHandler.js';
import { fileURLToPath } from 'url';
import path from 'path';

// __dirname 대체 (ESM 환경)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

// // static uploads (for file download)
// app.use('/uploads', express.static('uploads'));

app.use("/uploads/visible", express.static("uploads/visible", {
  setHeaders: (res, path) => {
    res.setHeader("Content-Type", "image/png");     // 확실히 지정
    res.removeHeader?.("Content-Disposition");      // 혹시 세팅되어 있으면 제거
  }
}));

// ✅ uploads 폴더를 static 경로로 공개
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// register routes
app.use('/api', routes);

// error handler (마지막)
app.use(errorHandler);

export default app;