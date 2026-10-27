import { Request, Response, NextFunction } from "express";

export interface IPublicResourceController {
  getPublicResources: (req: Request, res: Response, next: NextFunction) => void;

  getPublicResourceDetails: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
}
