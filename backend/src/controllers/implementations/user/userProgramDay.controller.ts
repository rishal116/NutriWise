import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";
import { IUserProgramDayController } from "../../interfaces/user/IUserProgramDayController";
import { IUserProgramDayService } from "../../../services/interfaces/user/IUserProgramDayService";

@injectable()
export class UserProgramDayController implements IUserProgramDayController {
  constructor(
    @inject(TYPES.IUserProgramDayService)
    private readonly _userProgramDayService: IUserProgramDayService,
  ) {}

  browseProgramDays = asyncHandler(async (req: Request, res: Response) => {
    const { programId } = req.params;
    const userId = req.user!.userId;

    const days = await this._userProgramDayService.browseProgramDays(
      userId,
      programId,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: days,
    });
  });

  getDayDetails = asyncHandler(async (req: Request, res: Response) => {
    const { programId, dayNumber } = req.params;
    const userId = req.user!.userId;

    const day = await this._userProgramDayService.getDayDetails(
      userId,
      programId,
      Number(dayNumber),
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: day,
    });
  });
}
