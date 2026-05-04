import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { INutriSessionController } from "../../interfaces/nutritionist/INutriSessionController";
import { TYPES } from "../../../types/types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";
import { INutriSessionService } from "../../../services/interfaces/nutritionist/INutriSessionService";

@injectable()
export class NutriSessionController implements INutriSessionController {
  constructor(
    @inject(TYPES.INutriSessionService)
    private _nutriSessionService: INutriSessionService,
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
        message: "Session created successfully",
        data: session,
      });
    },
  );

  getMySessions = asyncHandler(
    async (req: Request, res: Response, _next: NextFunction) => {
      const nutritionistId = req.user!.userId;

      const page = Math.max(parseInt(req.query.page as string) || 1, 1);
      const limit = Math.min(
        Math.max(parseInt(req.query.limit as string) || 10, 1),
        50,
      );

      const result = await this._nutriSessionService.getMySessions(
        nutritionistId,
        page,
        limit,
      );

      return res.status(StatusCode.OK).json({
        success: true,
        data: result.data,
        pagination: {
          total: result.total,
          page,
          limit,
          hasMore: page * limit < result.total,
        },
      });
    },
  );

  getSessionDetails = asyncHandler(async (req, res) => {
    const nutritionistId = req.user!.userId;
    const { sessionId } = req.params;

    const session = await this._nutriSessionService.getSessionDetails(
      nutritionistId,
      sessionId,
    );

    res.status(200).json({ success: true, data: session });
  });

  startSession = asyncHandler(async (req, res) => {
    const nutritionistId = req.user!.userId;
    const { sessionId } = req.params;

    await this._nutriSessionService.startSession(nutritionistId, sessionId);

    res.json({ success: true, message: "Session started" });
  });

  endSession = asyncHandler(async (req, res) => {
    const nutritionistId = req.user!.userId;
    const { sessionId } = req.params;

    await this._nutriSessionService.endSession(nutritionistId, sessionId);

    res.json({ success: true, message: "Session ended" });
  });
  cancelSession = asyncHandler(async (req, res) => {
    const nutritionistId = req.user!.userId;
    const { sessionId } = req.params;

    await this._nutriSessionService.cancelSession(nutritionistId, sessionId);

    res.json({ success: true, message: "Session cancelled" });
  });
}
