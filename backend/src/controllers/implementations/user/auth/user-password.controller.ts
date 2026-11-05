import type { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../../types/types";
import type { IPasswordResetService } from "../../../../services/interfaces/user/auth/IPasswordResetService";
import type { IUserPasswordController } from "../../../interfaces/user/auth/IUserPasswordController";

import { StatusCode } from "../../../../enums/statusCode.enum";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { AUTH_MESSAGES } from "../../../../constants";
import { sendResponse } from "../../../../utils/responseHandler";

@injectable()
export class UserPasswordController implements IUserPasswordController {
  constructor(
    @inject(TYPES.IPasswordResetService)
    private readonly _passwordResetService: IPasswordResetService,
  ) {}

  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    await this._passwordResetService.requestPasswordReset({ email });

    return sendResponse(
      res,
      StatusCode.OK,
      AUTH_MESSAGES.PASSWORD_RESET_OTP_SENT,
    );
  });

  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword, confirmPassword } = req.body;

    await this._passwordResetService.resetPassword({
      token,
      newPassword,
      confirmPassword,
    });

    return sendResponse(
      res,
      StatusCode.OK,
      AUTH_MESSAGES.PASSWORD_RESET_SUCCESS,
    );
  });
}
