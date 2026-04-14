import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { INutriProgramController } from "../../interfaces/nutritionist/INutriProgramController";
import { INutriProgramService } from "../../../services/interfaces/nutritionist/INutriProgramService";
import { TYPES } from "../../../types/types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class NutriProgramController implements INutriProgramController {
  constructor(
    @inject(TYPES.INutriProgramService)
    private _nutriProgramService: INutriProgramService,
  ) {}

  getPrograms = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;
    const programs =
      await this._nutriProgramService.getPrograms(nutritionistId);
    res.status(StatusCode.OK).json({ success: true, data: programs });
  });

  getProgramDetails = asyncHandler(async (req: Request, res: Response) => {
    const { programId } = req.params;
    const nutritionistId = req.user!.userId;

    const program = await this._nutriProgramService.getProgramDetails(
      programId,
      nutritionistId,
    );

    res.status(StatusCode.OK).json({ success: true, data: program });
  });

  getProgramDays = asyncHandler(async (req: Request, res: Response) => {
    const { programId } = req.params;
    const nutritionistId = req.user!.userId;

    const days = await this._nutriProgramService.getProgramDays(
      programId,
      nutritionistId,
    );

    res.status(StatusCode.OK).json({ success: true, data: days });
  });

  getProgramDayDetails = asyncHandler(async (req: Request, res: Response) => {
    const { dayId } = req.params;
    const nutritionistId = req.user!.userId;

    const day = await this._nutriProgramService.getProgramDayDetails(
      dayId,
      nutritionistId,
    );

    res.status(StatusCode.OK).json({ success: true, data: day });
  });

  createProgramDay = asyncHandler(async (req: Request, res: Response) => {
    const { programId } = req.params;
    const nutritionistId = req.user!.userId;

    const day = await this._nutriProgramService.createProgramDay(
      {
        ...req.body,
        userProgramId: programId,
      },
      nutritionistId,
    );

    res.status(StatusCode.OK).json({ success: true, data: day });
  });

  updateProgramDay = asyncHandler(async (req: Request, res: Response) => {
    const { dayId } = req.params;
    const nutritionistId = req.user!.userId;

    const updated = await this._nutriProgramService.updateProgramDay(
      dayId,
      req.body,
      nutritionistId,
    );

    res.status(StatusCode.OK).json({ success: true, data: updated });
  });

  deleteProgramDay = asyncHandler(async (req: Request, res: Response) => {
    const { dayId } = req.params;
    const nutritionistId = req.user!.userId;

    await this._nutriProgramService.deleteProgramDay(dayId, nutritionistId);
    res.status(StatusCode.NO_CONTENT).send();
  });
}
