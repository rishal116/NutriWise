
import type { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../../types/types";
import type { IUserContextService } from "../../../../services/interfaces/user/IUserContextService";
import type { IUserContextController } from "../../../interfaces/user/auth/IUserContextController";

import { sendResponse } from "../../../../utils/responseHandler";
import { StatusCode } from "../../../../enums/statusCode.enum";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { USER_MESSAGES } from "../../../../constants";

@injectable()
export class UserContextController implements IUserContextController {
  constructor(
    @inject(TYPES.IUserContextService)
    private readonly _userContextService: IUserContextService,
  ) {}

  getMe = asyncHandler(async (req: Request, res: Response) => {
    const response = await this._userContextService.getMe(req.user!.userId);

    return sendResponse(
      res,
      StatusCode.OK,
      USER_MESSAGES.CONTEXT_RETRIEVED_SUCCESS,
      response,
    );
  });
}
