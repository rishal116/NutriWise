import { Request, Response, NextFunction } from "express";

export interface IChatController {
  createDirectConversation: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void;

  sendMessage: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void;

  getUserChats: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void;

  getMessages: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void;
}
