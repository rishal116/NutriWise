import { Request, Response, NextFunction } from "express";

export interface IPublicResourceController {
  getPublicResources: (req: Request, res: Response, next: NextFunction) => void;
  getPublicResourceDetails: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
  recordResourceView: (req: Request, res: Response, next: NextFunction) => void;
  recordResourceDownload: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
  recordResourceShare: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
}
