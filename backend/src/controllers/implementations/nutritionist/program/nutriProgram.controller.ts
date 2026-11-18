import { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../../types/types";
import { StatusCode } from "../../../../enums/statusCode.enum";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendResponse } from "../../../../utils/responseHandler";

import { INutriProgramController } from "../../../interfaces/nutritionist/INutriProgramController";
import { INutriProgramService } from "../../../../services/interfaces/nutritionist/INutriProgramService";
import { GetProgramsQueryDTO } from "../../../../dtos/nutritionist/program/nutri-program-request.dto";
import { NutriProgramMessages } from "../../../../constants/nutritionist/program/nutri-program.messages.constants";

@injectable()
export class NutriProgramController implements INutriProgramController {
  constructor(
    @inject(TYPES.INutriProgramService)
    private readonly _nutriProgramService: INutriProgramService,
  ) {}

  getPrograms = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;

    const programs = await this._nutriProgramService.getPrograms(
      nutritionistId,
      req.query as unknown as GetProgramsQueryDTO,
    );

    return sendResponse(
      res,
      StatusCode.OK,
      NutriProgramMessages.PROGRAMS_FETCHED,
      programs,
    );
  });

  getProgramDetails = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;
    const { programId } = req.params;

    const program = await this._nutriProgramService.getProgramDetails(
      nutritionistId,
      { programId },
    );

    return sendResponse(
      res,
      StatusCode.OK,
      NutriProgramMessages.PROGRAM_DETAILS_FETCHED,
      program,
    );
  });

  markProgramAsReady = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;
    const { programId } = req.params;

    await this._nutriProgramService.markProgramAsReady(nutritionistId, {
      programId,
    });

    return sendResponse(
      res,
      StatusCode.OK,
      NutriProgramMessages.PROGRAM_MARKED_AS_READY,
    );
  });
}
