import type { Request, Response } from 'express';
import express from 'express';
import productServicesV1 from '../../services/v1/product.services';

const router = express.Router();

// Product Routes
router.get('/', (req: Request, res: Response) => {
  const products = productServicesV1.getAllProducts();
  res.json(products);
});

export default router;