import type { Request, Response } from 'express';
import { createProductSchema, getOneProductSchema } from '../../models/v1/product.models';
import express from 'express';
import schemaValidator from '../../middlewares/schemaValidator.middleware';
import productServicesV1 from '../../services/v1/product.services';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Product Routes
router.get('/', async (req: Request, res: Response) => {
  const products = await productServicesV1.getAllProducts();
  return res.json(products);
});

router.get('/:_id', schemaValidator(getOneProductSchema, 'params'), async (req: Request, res: Response) => {
  console.log(typeof req.params._id, req.params._id);
  if (typeof req.params._id !== 'string') {
    return res.status(400).json({ error: 'Invalid _id parameter' });
  }
  const _id = new ObjectId(req.params._id);
  const product = await productServicesV1.getOneProduct(_id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json(product);
});

router.post('/', schemaValidator(createProductSchema, 'body'), async (req: Request, res: Response) => {
  const createdId = await productServicesV1.createProduct(req.body);
  return res.json(createdId);
});

export default router;