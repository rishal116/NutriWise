import type { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../../types/types";
import { StatusCode } from "../../../../enums/statusCode.enum";
import { IUserProgramController } from "../../../interfaces/user/program/IUserProgramController";
import { IUserProgramService } from "../../../../services/interfaces/user/program/IUserProgramService";
import { UserProgramQueryMapper } from "../../../../mappers/user/program/user-program-query.mapper";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendResponse } from "../../../../utils/responseHandler";
import { USER_PROGRAM_MESSAGES } from "../../../../constants/user/program/user-program.messages";

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

    sendResponse(
      res,
      StatusCode.OK,
      USER_PROGRAM_MESSAGES.BROWSE_SUCCESS,
      result,
    );
  });

  getProgramDetails = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const { programId } = req.params;

    const program = await this._userProgramService.getProgramDetails(
      programId,
      userId,
    );

    sendResponse(
      res,
      StatusCode.OK,
      USER_PROGRAM_MESSAGES.DETAILS_SUCCESS,
      program,
    );
  });
}
