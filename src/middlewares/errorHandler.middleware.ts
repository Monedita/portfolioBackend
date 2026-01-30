import type { Request, Response, NextFunction } from 'express';

export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  // Manejo específico para errores de parseo de JSON
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      error: "Invalid JSON payload",
      message: err.message
    });
  } else {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  }
}
