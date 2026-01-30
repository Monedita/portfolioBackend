import type { Request, Response } from 'express';
import { createProductSchema, updateProductSchema, mongoDbIdSchema } from '../../models/v1/product.models';
import express from 'express';
import schemaValidator from '../../middlewares/schemaValidator.middleware';
import productServicesV1 from '../../services/v1/product.services';

const router = express.Router();

// Product Routes
router.get('/',
  async (req: Request, res: Response) => {
    const products = await productServicesV1.getAllProducts();
    return res.json(products);
  }
);

router.post('/',
  schemaValidator(createProductSchema, 'body'),
  async (req: Request, res: Response) => {
    const createdId = await productServicesV1.createProduct(req.body);
    return res.status(201).json(createdId);
  }
);

router.get('/:_id',
  schemaValidator(mongoDbIdSchema, 'params'),
  async (req: Request, res: Response) => {
    if (typeof req.params._id !== 'string') {
      return res.status(400).json({ error: 'Invalid _id parameter' });
    }
    const product = await productServicesV1.getOneProduct(req.params._id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json(product);
  }
);

router.put('/:_id',
  schemaValidator(mongoDbIdSchema, 'params'),
  schemaValidator(createProductSchema, 'body'),
  async (req: Request, res: Response) => {
    if (typeof req.params._id !== 'string') {
      return res.status(400).json({ error: 'Invalid _id parameter' });
    }
    const document = await productServicesV1.replaceProduct(req.params._id, req.body);
    if (!document) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json(document);
  }
);

router.patch('/:_id',
  schemaValidator(mongoDbIdSchema, 'params'),
  schemaValidator(updateProductSchema, 'body'),
  async (req: Request, res: Response) => {
    if (typeof req.params._id !== 'string') {
      return res.status(400).json({ error: 'Invalid _id parameter' });
    }
    const document = await productServicesV1.updateProduct(req.params._id, req.body);
    if (!document) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json(document);
  }
);

router.delete('/:_id', schemaValidator(mongoDbIdSchema, 'params'), async (req: Request, res: Response) => {
  if (typeof req.params._id !== 'string') {
    return res.status(400).json({ error: 'Invalid _id parameter' });
  }
  const result = await productServicesV1.deleteProduct(req.params._id);
  if (!result.acknowledged) {
    return res.status(500).json({ error: 'Failed to delete product' });
  } else if (result.deletedCount === 0) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.status(204).json({ message: 'Product deleted successfully' });
});

export default router;