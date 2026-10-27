import type { Request, Response, NextFunction } from "express";

export interface IPostViewController {
  viewPost(req: Request, res: Response, next: NextFunction): void;
}
