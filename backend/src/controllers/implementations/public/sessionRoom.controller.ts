import { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";

import { ISessionRoomService } from "../../../services/interfaces/public/ISessionRoomService";
import { ISessionRoomController } from "../../interfaces/public/ISessionRoomController";

@injectable()
export class SessionRoomController implements ISessionRoomController {
  constructor(
    @inject(TYPES.ISessionRoomService)
    private readonly _sessionRoomService: ISessionRoomService,
  ) {}

  joinSession = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { userId } = req.user!;

    const result = await this._sessionRoomService.joinSession(
      userId,
      sessionId,
    );

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Session room access granted successfully",
      data: result,
    });
  });
}
