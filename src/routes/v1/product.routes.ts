import type { Request, Response } from 'express';
import type { Product } from '../../models/v1/product.models';
import { createProductSchema, updateProductSchema, mongoDbIdSchema } from '../../models/v1/product.models';
import express from 'express';
import authValidator from '../../middlewares/auth.middleware';
import schemaValidator from '../../middlewares/schemaValidator.middleware';
import productServicesV1 from '../../services/v1/product.services';

const router = express.Router();


/**
/**
 * @openapi
 * /api/v1/products:
 *   get:
 *     summary: Get all products (with search & pagination)
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Text to search in product name and description
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         required: false
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 20
 *           default: 10
 *         required: false
 *         description: Number of products per page
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/',
  authValidator(false),
  async (req: Request, res: Response) => {
    const search: string | undefined = req.query.search as string | undefined;
    let page: number = parseInt(req.query.page as string, 10);
    page = isNaN(page) ? 1 : page < 1 ? 1 : page;
    let limit: number = parseInt(req.query.limit as string, 10);
    limit = isNaN(limit) ? 10 : limit < 1 ? 1 : limit > 20 ? 20 : limit;
    const products = await productServicesV1.getAllProducts(search, page, limit);
    return res.json(products);
  }
);


/**
 * @openapi
 * /api/v1/products:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created
 */
router.post('/',
  authValidator(true),
  schemaValidator(createProductSchema, 'body'),
  async (req: Request, res: Response) => {
    const product: Product = await productServicesV1.createProduct(req.body);
    return res.status(201).json(product);
  }
);


/**
 * @openapi
 * /api/v1/products/{_id}:
 *   get:
 *     summary: Get a product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get('/:_id',
  authValidator(false),
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


/**
 * @openapi
 * /api/v1/products/{_id}:
 *   put:
 *     summary: Replace a product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product replaced
 *       404:
 *         description: Product not found
 */
router.put('/:_id',
  authValidator(true),
  schemaValidator(mongoDbIdSchema, 'params'),
  schemaValidator(createProductSchema, 'body'),
  async (req: Request, res: Response) => {
    if (typeof req.params._id !== 'string') {
      return res.status(400).json({ error: 'Invalid _id parameter' });
    }
    const product = await productServicesV1.replaceProduct(req.params._id, req.body);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json(product);
  }
);


/**
 * @openapi
 * /api/v1/products/{_id}:
 *   patch:
 *     summary: Partially update a product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 */
router.patch('/:_id',
  authValidator(true),
  schemaValidator(mongoDbIdSchema, 'params'),
  schemaValidator(updateProductSchema, 'body'),
  async (req: Request, res: Response) => {
    if (typeof req.params._id !== 'string') {
      return res.status(400).json({ error: 'Invalid _id parameter' });
    }
    const product = await productServicesV1.updateProduct(req.params._id, req.body);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json(product);
  }
);


/**
 * @openapi
 * /api/v1/products/{_id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       204:
 *         description: Product successfully deleted
 *       404:
 *         description: Product not found
 */
router.delete('/:_id',
  authValidator(true),
  schemaValidator(mongoDbIdSchema, 'params'), async (req: Request, res: Response) => {
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
  }
);

export default router;