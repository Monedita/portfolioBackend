import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || "Pl.E@k3y!Pl.E@k3y!";
const JWT_OPTIONS = process.env.JWT_OPTIONS
    ? JSON.parse(process.env.JWT_OPTIONS)
    : { expiresIn: '1h', issuer: 'demoBackend' }

export default function authValidator(requireAdmin: boolean = true) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Unauthorized' });
        }
        const token = authHeader?.split(' ')[1] || "";
        const payload: any = jwt.verify(token!, JWT_SECRET, JWT_OPTIONS);
        if (requireAdmin && !payload.admin) {
            res.status(403).json({ message: 'Forbidden: Admins only' });
        }
        // req.user = payload;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
  }
}
