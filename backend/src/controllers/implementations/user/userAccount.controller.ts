import type { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";
import type { IUserAccountController } from "../../interfaces/user/IUserAccountController";
import type { IUserAccountService } from "../../../services/interfaces/user/IUserAccountService";

import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";
import { sendResponse } from "../../../utils/responseHandler";
import { USER_MESSAGES } from "../../../constants";

@injectable()
export class UserAccountController implements IUserAccountController {
  constructor(
    @inject(TYPES.IUserAccountService)
    private readonly _userAccountService: IUserAccountService,
  ) {}

  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const { currentPassword, newPassword } = req.body;

    await this._userAccountService.changePassword(
      userId,
      currentPassword,
      newPassword,
    );

    return sendResponse(res, StatusCode.OK, USER_MESSAGES.PASSWORD_CHANGED);
  });
}
