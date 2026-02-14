import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";
import { CustomError } from "../../../utils/customError";
import { IUserAccountController } from "../../interfaces/user/IUserAccountController";
import { IUserAccountService } from "../../../services/interfaces/user/IUserAccountService";
import { AUTH_MESSAGES, COMMON_MESSAGES, USER_MESSAGES } from "../../../constants";

@injectable()
export class UserAccountController implements IUserAccountController {
  constructor(
    @inject(TYPES.IUserAccountService)
    private _userAccountService: IUserAccountService
  ) {}

  changePassword = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: AUTH_MESSAGES.UNAUTHORIZED,
      });
    }

    const { userId } = req.user;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new CustomError(
        COMMON_MESSAGES.VALIDATION_FAILED,
        StatusCode.BAD_REQUEST
      );
    }

    await this._userAccountService.changePassword(
      userId,
      currentPassword,
      newPassword
    );

    return res.status(StatusCode.OK).json({
      success: true,
      message: USER_MESSAGES.PASSWORD_CHANGED,
    });
  });
}
