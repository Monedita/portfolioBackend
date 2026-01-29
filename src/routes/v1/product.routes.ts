import type { Request, Response, NextFunction } from 'express';
import { createProductSchema } from '../../models/v1/product.models';
import express from 'express';
import schemaValidator from '../../middlewares/schemaValidator.middleware';
import productServicesV1 from '../../services/v1/product.services';

const router = express.Router();

// Product Routes
router.get('/', async (req: Request, res: Response) => {
  const products = await productServicesV1.getAllProducts();
  res.json(products);
});

router.post('/', schemaValidator(createProductSchema, 'body'), async (req: Request, res: Response) => {
    const createdId = await productServicesV1.createProduct(req.body);
    res.json(createdId);
  }
);

export default router;