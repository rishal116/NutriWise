import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";
import { IUserProgramController } from "../../interfaces/user/IUserProgramController";
import { IUserProgramService } from "../../../services/interfaces/user/IUserProgramService";
import { UserProgramListQueryDTO } from "../../../dtos/user/program/user-Program-list-query.dto";

@injectable()
export class UserProgramController implements IUserProgramController {
  constructor(
    @inject(TYPES.IUserProgramService)
    private readonly _userProgramService: IUserProgramService,
  ) {}

  browsePrograms = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const query: UserProgramListQueryDTO = {
      limit: Number(req.query.limit ?? 10),
      cursor: req.query.cursor as string | undefined,
      search: req.query.search as string | undefined,
      status: req.query.status as UserProgramListQueryDTO["status"],
      sort: req.query.sort as UserProgramListQueryDTO["sort"],
    };

    const result = await this._userProgramService.browsePrograms(userId, query);

    res.status(StatusCode.OK).json({
      success: true,
      data: result,
    });
  });

  getProgramDetails = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { programId } = req.params;

    const program = await this._userProgramService.getProgramDetails(
      programId,
      userId,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: program,
    });
  });
}
