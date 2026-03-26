import { NextFunction, Request, Response } from "express";
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
    private _userProgramService: IUserProgramService,
  ) {}

  getProgramDays = asyncHandler(async (req: Request, res: Response) => {
    const { programId } = req.params;
    const userId = req.user?.userId!;

    const days = await this._userProgramService.getProgramDays(
      programId,
      userId,
    );

    res.status(StatusCode.OK).json({ success: true, data: days });
  });

  getProgramDayByNumber = asyncHandler(async (req: Request, res: Response) => {
    const { dayNumber } = req.params;
    const { programId } = req.params;

    const day = await this._userProgramService.getProgramDayByNumber(
      Number(dayNumber),
      programId,
    );

    res.status(StatusCode.OK).json({ success: true, data: day });
  });
}
