import type { Request, Response, NextFunction } from 'express';
import type { Schema } from 'joi';


export default function schemaValidator(schema: Schema, property: keyof Request = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[property] ?? {}; // req.body, req.params, req.query
    // abortEarly: false to gather all errors
    // convert: false to avoid type coercion, e.g., string to number
    const { error } = schema.validate(data, { abortEarly: false, convert: false });
    if (error) {
      res.status(400).json(error.details);
    } else {
      next();
    }
  }
}
