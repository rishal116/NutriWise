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

  getPublicSessions = asyncHandler(async (req: Request, res: Response) => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const result = await this._service.getPublicSessions(page, limit, {
      status: req.query.status as string,
      type: req.query.type as string,
      search: req.query.search as string,
      sortBy: req.query.sortBy as string,
      sortOrder: req.query.sortOrder as "asc" | "desc",
    });
    res.status(StatusCode.OK).json({
      success: true,
      message: "Public sessions fetched successfully",
      data: result.data,
      pagination: result.pagination,
    });
  });

  getMySessions = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const sessions = await this._service.getMySessions(userId);
    res.status(StatusCode.OK).json({
      success: true,
      message: "My sessions fetched successfully",
      data: sessions,
    });
  });

  getPublicSessionDetails = asyncHandler(
    async (req: Request, res: Response) => {
      const { sessionId } = req.params;
      const session = await this._service.getPublicSessionDetails(sessionId);
      res.status(StatusCode.OK).json({
        success: true,
        message: "Session details fetched successfully",
        data: session,
      });
    },
  );
  
  getMySessionDetails = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { sessionId } = req.params;
    const session = await this._service.getMySessionDetails(userId, sessionId);
    res.status(StatusCode.OK).json({
      success: true,
      message: "My session details fetched successfully",
      data: session,
    });
  });
  
  joinFreeSession = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { sessionId } = req.params;
    await this._service.joinFreeSession(userId, sessionId);
    res.status(StatusCode.OK).json({
      success: true,
      message: "Joined free session successfully",
    });
  });

  createPaidSessionPayment = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user!.userId;
      const { sessionId } = req.params;
      const payment = await this._service.createPaidSessionPayment(
        userId,
        sessionId,
      );
      res.status(StatusCode.OK).json({
        success: true,
        message: "Payment intent created successfully",
        data: payment,
      });
    },
  );
  
  verifySessionPayment = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    await this._service.verifySessionPayment(sessionId);
    res.status(StatusCode.OK).json({
      success: true,
      message: "Payment verified successfully",
    });
  });
  
  leaveSession = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { sessionId } = req.params;
    await this._service.leaveSession(userId, sessionId);
    res.status(StatusCode.OK).json({
      success: true,
      message: "Left session successfully",
    });
  });

  getSessionAccess = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { sessionId } = req.params;
    const access = await this._service.getSessionAccess(userId, sessionId);
    res.status(StatusCode.OK).json({
      success: true,
      message: "Session access granted",
      data: access,
    });
  });
  
}
