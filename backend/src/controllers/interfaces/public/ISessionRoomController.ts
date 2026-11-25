import { RequestHandler } from "express";

export interface ISessionRoomController {
  getSessionRoomDetails: RequestHandler;
  joinSession: RequestHandler;
  startSession: RequestHandler;
  endSession: RequestHandler;
}
