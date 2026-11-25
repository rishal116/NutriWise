import type { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";
import { sendResponse } from "../../../utils/responseHandler";

import type { ISessionRoomService } from "../../../services/interfaces/public/ISessionRoomService";
import type { ISessionRoomController } from "../../interfaces/public/ISessionRoomController";

import { SESSION_ROOM_MESSAGES } from "../../../constants/public/session/session-room.messages";

@injectable()
export class SessionRoomController implements ISessionRoomController {
  constructor(
    @inject(TYPES.ISessionRoomService)
    private readonly _sessionRoomService: ISessionRoomService,
  ) {}

  getSessionRoomDetails = asyncHandler(async (req: Request, res: Response) => {
    const { roomId } = req.params;
    const { userId } = req.user!;

    const result = await this._sessionRoomService.getSessionRoomDetails(
      userId,
      roomId,
    );

    return sendResponse(
      res,
      StatusCode.OK,
      SESSION_ROOM_MESSAGES.DETAILS_RETRIEVED,
      result,
    );
  });

  joinSession = asyncHandler(async (req: Request, res: Response) => {
    const { roomId } = req.params;
    const { userId } = req.user!;

    const result = await this._sessionRoomService.joinSession(userId, roomId);

    return sendResponse(
      res,
      StatusCode.OK,
      SESSION_ROOM_MESSAGES.ACCESS_GRANTED,
      result,
    );
  });

  startSession = asyncHandler(async (req: Request, res: Response) => {
    const { roomId } = req.params;
    const { userId } = req.user!;

    await this._sessionRoomService.startSession(userId, roomId);

    return sendResponse(res, StatusCode.OK, SESSION_ROOM_MESSAGES.STARTED);
  });

  endSession = asyncHandler(async (req: Request, res: Response) => {
    const { roomId } = req.params;
    const { userId } = req.user!;

    await this._sessionRoomService.endSession(userId, roomId);

    return sendResponse(res, StatusCode.OK, SESSION_ROOM_MESSAGES.ENDED);
  });
}
