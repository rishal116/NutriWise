import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { IUserSessionController } from "../../interfaces/user/IUserSessionController";
import { IUserSessionService } from "../../../services/interfaces/user/IUserSessionService";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class UserSessionController implements IUserSessionController {
  constructor(
    @inject(TYPES.IUserSessionService)
    private _service: IUserSessionService,
  ) {}

  getSessions = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    if (!userId) {
      res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const sessions = await this._service.getSessions(userId);

    res.status(StatusCode.OK).json({
      success: true,
      data: sessions,
    });
  });

  joinSession = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { sessionId } = req.body;

    await this._service.joinSession(userId, sessionId);

    res.status(StatusCode.OK).json({
      success: true,
      message: "Join request successful",
    });
  });

  leaveSession = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { sessionId } = req.body;

    await this._service.leaveSession(userId, sessionId);

    res.status(StatusCode.OK).json({
      success: true,
      message: "Left session successfully",
    });
  });
}
