import { ZodObject, ZodRawShape } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate =
  (schema: ZodObject<ZodRawShape>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({ body: req.body });
      next();
    } catch (err: any) {
      console.error('Validation error:', err.errors);
      res.status(400).json({ 
        message: 'Validation failed',
        errors: err.errors?.map((e: any) => ({
          field: e.path.join('.'),
          message: e.message,
        })) || err.errors 
      });
    }
  };
