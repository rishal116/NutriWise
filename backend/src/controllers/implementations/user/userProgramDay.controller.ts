import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";
import { IUserProgramDayController } from "../../interfaces/user/IUserProgramDayController";
import { IUserProgramDayService } from "../../../services/interfaces/user/program/IUserProgramDayService";
import { UserProgramDayListQueryDTO } from "../../../dtos/user/program/user-program-day-list-query.dto";

@injectable()
export class UserProgramDayController implements IUserProgramDayController {
  constructor(
    @inject(TYPES.IUserProgramDayService)
    private readonly _userProgramDayService: IUserProgramDayService,
  ) {}

  browseProgramDays = asyncHandler(async (req: Request, res: Response) => {
    const { programId } = req.params;
    const userId = req.user!.userId;

    const query: UserProgramDayListQueryDTO = {
      limit: req.query.limit ? Number(req.query.limit) : undefined,

      cursor:
        typeof req.query.cursor === "string" ? req.query.cursor : undefined,

      search:
        typeof req.query.search === "string" ? req.query.search : undefined,

      status:
        typeof req.query.status === "string"
          ? (req.query.status as UserProgramDayListQueryDTO["status"])
          : undefined,

      locked:
        req.query.locked !== undefined
          ? req.query.locked === "true"
          : undefined,

      sort:
        typeof req.query.sort === "string"
          ? (req.query.sort as UserProgramDayListQueryDTO["sort"])
          : undefined,
    };

    const days = await this._userProgramDayService.browseProgramDays(
      userId,
      programId,
      query,
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
