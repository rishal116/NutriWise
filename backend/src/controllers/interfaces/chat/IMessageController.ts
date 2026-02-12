import { Request, Response, NextFunction } from "express";

export interface IMessageController {
    sendMessage: (req: Request,res: Response,next: NextFunction) => void;
    getMessages: (req: Request,res: Response,next: NextFunction) => void;
}
