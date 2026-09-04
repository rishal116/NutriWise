import { NextFunction, Request, Response } from "express";

export interface ISessionRoomController {
  joinSession(req: Request, res: Response, next: NextFunction): void;
}
