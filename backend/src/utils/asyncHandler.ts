import { Request, Response, NextFunction } from "express";

type AsyncController<T = any> = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<T>;

export const asyncHandler =
  <T = any>(fn: AsyncController<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
