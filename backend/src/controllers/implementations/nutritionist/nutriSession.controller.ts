import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { INutriSessionController } from "../../interfaces/nutritionist/INutriSessionController";
import { INutriSessionService } from "../../../services/interfaces/nutritionist/INutriSessionService";
import { TYPES } from "../../../types/types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";
import { NUTRITIONIST_MESSAGES } from "../../../constants/index";

@injectable()
export class NutriSessionController implements INutriSessionController {
  constructor(
    @inject(TYPES.INutriSessionService)
    private readonly _nutriSessionService: INutriSessionService,
  ) {}

  createSession = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const nutritionistId = req.user!.userId;
      const session = await this._nutriSessionService.createSession(
        nutritionistId,
        req.body,
      );
      return res.status(StatusCode.CREATED).json({
        success: true,
        message: NUTRITIONIST_MESSAGES.SESSION_CREATED,
        data: session,
      });
    },
  );

  getMySessions = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;
    const query = {
      page: Math.max(Number(req.query.page) || 1, 1),
      limit: Math.min(Math.max(Number(req.query.limit) || 10, 1), 50),
      search: req.query.search as string,
      status: req.query.status as "scheduled" | "live" | "ended" | "cancelled",
      type: req.query.type as "free" | "paid",
      sortBy: req.query.sortBy as "scheduledAt" | "createdAt",
      sortOrder: req.query.sortOrder as "asc" | "desc",
    };
    const result = await this._nutriSessionService.getMySessions(
      nutritionistId,
      query,
    );
    return res.status(StatusCode.OK).json({
      success: true,
      message: NUTRITIONIST_MESSAGES.SESSIONS_FETCHED,
      data: result.data,
      pagination: result.pagination,
    });
  });

  getSessionDetails = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const nutritionistId = req.user!.userId;
      const { sessionId } = req.params;
      const session = await this._nutriSessionService.getSessionDetails(
        nutritionistId,
        sessionId,
      );
      return res.status(StatusCode.OK).json({
        success: true,
        message: NUTRITIONIST_MESSAGES.SESSION_DETAILS_FETCHED,
        data: session,
      });
    },
  );

  startSession = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const nutritionistId = req.user!.userId;
      const { sessionId } = req.params;
      await this._nutriSessionService.startSession(nutritionistId, sessionId);
      return res.status(StatusCode.OK).json({
        success: true,
        message: NUTRITIONIST_MESSAGES.SESSION_STARTED,
      });
    },
  );

  endSession = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const nutritionistId = req.user!.userId;
      const { sessionId } = req.params;
      await this._nutriSessionService.endSession(nutritionistId, sessionId);
      return res.status(StatusCode.OK).json({
        success: true,
        message: NUTRITIONIST_MESSAGES.SESSION_ENDED,
      });
    },
  );

  cancelSession = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const nutritionistId = req.user!.userId;
      const { sessionId } = req.params;
      await this._nutriSessionService.cancelSession(nutritionistId, sessionId);
      return res.status(StatusCode.OK).json({
        success: true,
        message: NUTRITIONIST_MESSAGES.SESSION_CANCELLED,
      });
    },
  );
}
