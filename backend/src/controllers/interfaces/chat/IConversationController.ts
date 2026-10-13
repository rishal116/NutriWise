import { Request, Response, NextFunction } from "express";

export interface IConversationController {
  createDirectConversation: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;

  getUserConversations: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;

  getUserConversationDetails: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
}
