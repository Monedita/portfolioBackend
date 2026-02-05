import express from 'express';
import productRouter from './product.routes';
import authRouter from './auth.routes';

const router = express.Router();

// Routes
router.use('/products', productRouter);
router.use('/auth', authRouter);

export default router