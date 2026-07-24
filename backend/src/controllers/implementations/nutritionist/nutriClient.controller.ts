import { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";

import { asyncHandler } from "../../../utils/asyncHandler";

import { StatusCode } from "../../../enums/statusCode.enum";

import { INutriClientController } from "../../interfaces/nutritionist/INutriClientController";
import { INutriClientService } from "../../../services/interfaces/nutritionist/INutriClientService";

@injectable()
export class NutriClientController implements INutriClientController {
  constructor(
    @inject(TYPES.INutriClientService)
    private readonly _nutriClientService: INutriClientService,
  ) {}

  getClients = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;

    const clients = await this._nutriClientService.getClients(
      nutritionistId,
      req.query,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: clients,
    });
  });

  getClientDetails = asyncHandler(async (req: Request, res: Response) => {
    const { clientId } = req.params;

    const nutritionistId = req.user!.userId;

    const client = await this._nutriClientService.getClientDetails(
      nutritionistId,
      {
        clientId,
      },
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: client,
    });
  });
}
