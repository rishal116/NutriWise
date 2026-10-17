import { NextFunction, Request, Response } from "express";

export interface ISessionRoomController {
  joinSession(req: Request, res: Response, next: NextFunction): void;

  startSession(req: Request, res: Response, next: NextFunction): void;

  endSession(req: Request, res: Response, next: NextFunction): void;
}
