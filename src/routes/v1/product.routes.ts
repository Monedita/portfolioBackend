import type { Request, Response } from 'express';
import express from 'express';

const router = express.Router();

// Product Routes
router.get('/', (req: Request, res: Response) => {
  res.json([{
    id: 1,
    name: 'Sample Product',
    price: 1999 //in cents
  }, {
    id: 2,
    name: 'Another Product',
    price: 2999 //in cents
  }]);
});

export default router;