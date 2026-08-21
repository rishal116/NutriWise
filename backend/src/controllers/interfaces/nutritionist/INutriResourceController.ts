import { Request, Response, NextFunction } from "express";

export interface INutriResourceController {
  createResource: (req: Request, res: Response, next: NextFunction) => void;

  getResources: (req: Request, res: Response, next: NextFunction) => void;

  getResourceDetails: (req: Request, res: Response, next: NextFunction) => void;

  updateResource: (req: Request, res: Response, next: NextFunction) => void;

  publishResource: (req: Request, res: Response, next: NextFunction) => void;

  archiveResource: (req: Request, res: Response, next: NextFunction) => void;
}
