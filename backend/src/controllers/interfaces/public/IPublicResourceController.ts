import { Request, Response, NextFunction } from "express";

export interface IPublicResourceController {
  getPublicResources: (req: Request, res: Response, next: NextFunction) => void;

  getPublicResourceDetails: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;

  recordResourceView: (req: Request, res: Response, next: NextFunction) => void;

  likeResource: (req: Request, res: Response, next: NextFunction) => void;

  unlikeResource: (req: Request, res: Response, next: NextFunction) => void;

  bookmarkResource: (req: Request, res: Response, next: NextFunction) => void;

  unbookmarkResource: (req: Request, res: Response, next: NextFunction) => void;

  addResourceComment: (req: Request, res: Response, next: NextFunction) => void;

  deleteResourceComment: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
}
