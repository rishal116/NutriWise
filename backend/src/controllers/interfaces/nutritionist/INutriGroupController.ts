import { Request, Response, NextFunction } from "express";

export interface INutriGroupController {
  createGroup: (req: Request, res: Response, next: NextFunction) => void;
  getMyGroups: (req: Request, res: Response, next: NextFunction) => void;
  getGroup: (req: Request, res: Response, next: NextFunction) => void;
  getJoinRequests: (req: Request, res: Response, next: NextFunction) => void;
  acceptRequest: (req: Request, res: Response, next: NextFunction) => void;
  rejectRequest: (req: Request, res: Response, next: NextFunction) => void;
}
