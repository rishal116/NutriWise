import { Request, Response, NextFunction } from "express";

export interface IConversationController {
  createDirectConversation: (req: Request,res: Response,next: NextFunction) => void;
  getUserChats: (req: Request,res: Response,next: NextFunction) => void;
}
