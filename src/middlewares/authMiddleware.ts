// middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'defaultSecret';

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authorizationHeader = req.headers.authorization;

  if (typeof authorizationHeader !== 'string') {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const token = authorizationHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    (req as any).user = user;

    next();
  });
}