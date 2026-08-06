import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";
import { IUserProgramController } from "../../interfaces/user/IUserProgramController";
import { IUserProgramService } from "../../../services/interfaces/user/program/IUserProgramService";
import { UserProgramQueryMapper } from "../../../mapper/user/program/user-program-query.mapper";

@injectable()
export class UserProgramController implements IUserProgramController {
  constructor(
    @inject(TYPES.IUserProgramService)
    private readonly _userProgramService: IUserProgramService,
  ) {}

  browsePrograms = asyncHandler(async (req: Request, res: Response) => {
    const result = await this._userProgramService.browsePrograms(
      req.user!.userId,
      UserProgramQueryMapper.toListQueryDTO(req.query),
    );
    res.status(StatusCode.OK).json({
      success: true,
      message: "Programs retrieved successfully.",
      data: result,
    });
  });

  getProgramDetails = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const { programId } = req.params;

    const program = await this._userProgramService.getProgramDetails(
      programId,
      userId,
    );

    res.status(StatusCode.OK).json({
      success: true,
      message: "Program details retrieved successfully.",
      data: program,
    });
  });
}
