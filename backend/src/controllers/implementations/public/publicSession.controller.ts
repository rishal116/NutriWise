import { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";

import { IPublicSessionController } from "../../interfaces/public/IPublicSessionController";
import { IPublicSessionService } from "../../../services/interfaces/public/IPublicSessionService";

import { PublicSessionListQueryDTO } from "../../../dtos/public/session/public-session-list-query.dto";

@injectable()
export class PublicSessionController implements IPublicSessionController {
  constructor(
    @inject(TYPES.IPublicSessionService)
    private readonly _publicSessionService: IPublicSessionService,
  ) {}

  getPublicSessions = asyncHandler(async (req: Request, res: Response) => {
    const query: PublicSessionListQueryDTO = {
      limit: Number(req.query.limit) || 12,
      cursor: req.query.cursor as string | undefined,
      search: req.query.search as string | undefined,
      type: req.query.type as PublicSessionListQueryDTO["type"],
      pricingType: req.query
        .pricingType as PublicSessionListQueryDTO["pricingType"],
      sortBy: req.query.sortBy as PublicSessionListQueryDTO["sortBy"],
    };

    const sessions = await this._publicSessionService.getPublicSessions(query);

    res.status(StatusCode.OK).json({
      success: true,
      data: sessions,
    });
  });

  getPublicSessionDetails = asyncHandler(
    async (req: Request, res: Response) => {
      const { sessionId } = req.params;

      const session =
        await this._publicSessionService.getPublicSessionDetails(sessionId);

      res.status(StatusCode.OK).json({
        success: true,
        data: session,
      });
    },
  );
}
