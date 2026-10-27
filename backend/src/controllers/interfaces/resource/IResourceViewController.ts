import type { Request, Response, NextFunction } from "express";

export interface IResourceViewController {
    recordView (req: Request, res: Response, next: NextFunction): void;
}
