import type { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../../types/types";
import type { ISignupService } from "../../../../services/interfaces/user/auth/ISignupService";
import type { ILoginService } from "../../../../services/interfaces/user/auth/ILoginService";
import type { IUserAuthController } from "../../../interfaces/user/auth/IUserAuthController";

import { StatusCode } from "../../../../enums/statusCode.enum";
import logger from "../../../../utils/logger";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendResponse } from "../../../../utils/responseHandler";
import { setAuthCookies, clearAuthCookies } from "../../../../utils/token.util";
import { AUTH_MESSAGES } from "../../../../constants";

@injectable()
export class UserAuthController implements IUserAuthController {
  constructor(
    @inject(TYPES.ISignupService)
    private readonly _signupService: ISignupService,

    @inject(TYPES.ILoginService)
    private readonly _loginService: ILoginService,
  ) {}

  signup = asyncHandler(async (req: Request, res: Response) => {
    const { fullName, email, password, confirmPassword } = req.body;

    await this._signupService.signup(req, {
      fullName,
      email,
      password,
      confirmPassword,
    });

    return sendResponse(res, StatusCode.OK, AUTH_MESSAGES.SIGNUP_SUCCESS);
  });

  verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    const response = await this._signupService.verifyOtp(req, {
      email,
      otp,
    });

    setAuthCookies(res, response.refreshToken);

    return sendResponse(
      res,
      StatusCode.CREATED,
      AUTH_MESSAGES.OTP_VERIFIED_SUCCESS,
      {
        accessToken: response.accessToken,
      },
    );
  });

  resendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    await this._signupService.resendOtp({ email });

    return sendResponse(res, StatusCode.OK, AUTH_MESSAGES.OTP_RESENT_SUCCESS);
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const response = await this._loginService.login({
      email,
      password,
    });

    setAuthCookies(res, response.refreshToken);

    return sendResponse(res, StatusCode.OK, AUTH_MESSAGES.LOGIN_SUCCESS, {
      activeRole: response.activeRole,
      isProfileCompleted: response.isProfileCompleted,
      accessToken: response.accessToken,
    });
  });

  googleAuth = asyncHandler(async (req: Request, res: Response) => {
    const { credential } = req.body;

    const response = await this._loginService.googleAuth({ credential });

    setAuthCookies(res, response.refreshToken);

    return sendResponse(res, StatusCode.OK, AUTH_MESSAGES.LOGIN_SUCCESS, {
      activeRole: response.activeRole,
      isProfileCompleted: response.isProfileCompleted,
      accessToken: response.accessToken,
    });
  });

  logout = asyncHandler(async (_req: Request, res: Response) => {
    clearAuthCookies(res);
    logger.info("User logged out");

    return sendResponse(res, StatusCode.OK, AUTH_MESSAGES.LOGOUT_SUCCESS);
  });
}
