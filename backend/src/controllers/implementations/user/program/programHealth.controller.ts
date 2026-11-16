import type { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../../types/types";
import { StatusCode } from "../../../../enums/statusCode.enum";

import type { IProgramHealthController } from "../../../interfaces/user/program/IProgramHealthController";
import type { IProgramHealthService } from "../../../../services/interfaces/user/program/IProgramHealthService";

import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendResponse } from "../../../../utils/responseHandler";
import { PROGRAM_HEALTH_MESSAGES } from "../../../../constants/user/program/program-health.messages";

@injectable()
export class ProgramHealthController implements IProgramHealthController {
  constructor(
    @inject(TYPES.IProgramHealthService)
    private readonly _programHealthService: IProgramHealthService,
  ) {}

  createProgramHealth = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const { programId } = req.params;

    await this._programHealthService.createProgramHealth(
      userId,
      programId,
      req.body,
    );

    sendResponse(
      res,
      StatusCode.CREATED,
      PROGRAM_HEALTH_MESSAGES.CREATE_SUCCESS,
    );
  });

  getProgramHealth = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const { programId } = req.params;

    const programHealth = await this._programHealthService.getProgramHealth(
      userId,
      programId,
    );

    sendResponse(
      res,
      StatusCode.OK,
      PROGRAM_HEALTH_MESSAGES.DETAILS_SUCCESS,
      programHealth,
    );
  });

  updateProgramHealth = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const { programId } = req.params;

    await this._programHealthService.updateProgramHealth(
      userId,
      programId,
      req.body,
    );

    sendResponse(res, StatusCode.OK, PROGRAM_HEALTH_MESSAGES.UPDATE_SUCCESS);
  });
}
