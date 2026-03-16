import { Request, Response, NextFunction } from "express";

export interface IMessageController {
    sendMessage: (req: Request,res: Response,next: NextFunction) => void;
    getMessages: (req: Request,res: Response,next: NextFunction) => void;
    sendFile: (req: Request,res: Response,next: NextFunction) => void;
    markAsRead: (req: Request,res: Response,next: NextFunction) => void;
    deleteMessage: (req: Request,res: Response,next: NextFunction) => void;
    editMessage: (req: Request,res: Response,next: NextFunction) => void;
}
