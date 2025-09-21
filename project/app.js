// src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet'
import morgan from 'morgan'
import routes from './routes/index.js'
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// static uploads (for file download)
app.use('/uploads', express.static('uploads'));

// register routes
app.use('/api', routes);

// error handler (마지막)
app.use(errorHandler);

export default app;