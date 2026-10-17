import type { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";
import type { IPublicSessionController } from "../../interfaces/public/IPublicSessionController";
import type { IPublicSessionService } from "../../../services/interfaces/public/IPublicSessionService";
import { PublicSessionListQueryDTO } from "../../../dtos/public/session/public-session-list-query.dto";

@injectable()
export class PublicSessionController implements IPublicSessionController {
  constructor(
    @inject(TYPES.IPublicSessionService)
    private readonly _publicSessionService: IPublicSessionService,
  ) {}

  getPublicSessions = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const query = Object.assign(new PublicSessionListQueryDTO(), {
        limit: req.query.limit,
        cursor: req.query.cursor,
        search: req.query.search,
        type: req.query.type,
        pricingType: req.query.pricingType,
        sortBy: req.query.sortBy,
      });

      const sessions =
        await this._publicSessionService.getPublicSessions(query);

      res.status(StatusCode.OK).json({
        success: true,
        data: sessions,
      });
    },
  );

  getPublicSessionDetails = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.user?.userId;

      const session = await this._publicSessionService.getPublicSessionDetails(
        req.params.sessionId,
        userId,
      );

      res.status(StatusCode.OK).json({
        success: true,
        data: session,
      });
    },
  );
}
