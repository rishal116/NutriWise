import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { IUserProgramService } from "../../../services/interfaces/user/IUserProgramService";
import { IUserProgramController } from "../../interfaces/user/IUserProgramController";
import { TYPES } from "../../../types/types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class UserProgramController implements IUserProgramController {
  constructor(
    @inject(TYPES.IUserProgramService)
    private _userProgramService: IUserProgramService
  ) {}

  getPrograms = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId!;
    const programs = await this._userProgramService.getPrograms(userId);
    res.status(StatusCode.OK).json({success: true,data: programs});
  });

  getProgramDetails = asyncHandler(async (req: Request, res: Response) => {
    const { programId } = req.params;
    const userId = req.user?.userId!;

    const program = await this._userProgramService.getProgramDetails(
      programId,
      userId
    );

    res.status(StatusCode.OK).json({success: true,data: program});
  });

  getProgramDays = asyncHandler(async (req: Request, res: Response) => {
    const { programId } = req.params;
    const userId = req.user?.userId!;

    const days = await this._userProgramService.getProgramDays(
      programId,
      userId
    );

    res.status(StatusCode.OK).json({success: true,data:days});
  });

  getProgramDayDetails = asyncHandler(async (req: Request, res: Response) => {
    const { dayId } = req.params;
    const userId = req.user?.userId!;

    const day = await this._userProgramService.getProgramDayDetails(
      dayId,
      userId
    );

    res.status(StatusCode.OK).json({success: true,data: day});
  });

}