import express from 'express';
import productRouter from './product.routes';

const router = express.Router();

// Routes
router.use('/products', productRouter);

export default router