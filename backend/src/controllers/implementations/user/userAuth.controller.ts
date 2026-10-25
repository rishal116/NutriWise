import type { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";
import type { IUserAuthService } from "../../../services/interfaces/user/IUserAuthService";
import type { IUserAuthController } from "../../interfaces/user/IUserAuthController";

import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { asyncHandler } from "../../../utils/asyncHandler";
import { setAuthCookies, clearAuthCookies } from "../../../utils/token.util";
import { AUTH_MESSAGES } from "../../../constants";

@injectable()
export class UserAuthController implements IUserAuthController {
  constructor(
    @inject(TYPES.IUserAuthService)
    private readonly _userAuthService: IUserAuthService,
  ) {}

  signup = asyncHandler(async (req: Request, res: Response) => {
    const { fullName, email, password, confirmPassword } = req.body;

    await this._userAuthService.signup(req, {
      fullName,
      email,
      password,
      confirmPassword,
    });

    return res.status(StatusCode.OK).json({
      success: true,
      message: AUTH_MESSAGES.SIGNUP_SUCCESS,
    });
  });

  resendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    await this._userAuthService.resendOtp({ email });

    return res.status(StatusCode.OK).json({
      success: true,
      message: AUTH_MESSAGES.OTP_RESENT_SUCCESS,
    });
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    await this._userAuthService.requestPasswordReset({ email });

    return res.status(StatusCode.OK).json({
      success: true,
      message: AUTH_MESSAGES.PASSWORD_RESET_OTP_SENT,
    });
  });

  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword, confirmPassword } = req.body;

    await this._userAuthService.resetPassword({
      token,
      newPassword,
      confirmPassword,
    });

    return res.status(StatusCode.OK).json({
      success: true,
      message: AUTH_MESSAGES.PASSWORD_RESET_SUCCESS,
    });
  });

  getMe = asyncHandler(async (req: Request, res: Response) => {
    const response = await this._userAuthService.getMe(req.user!.userId);

    return res.status(StatusCode.OK).json({
      success: true,
      message: "User profile retrieved successfully.",
      data: response,
    });
  });

  logout = asyncHandler(async (_req: Request, res: Response) => {
    clearAuthCookies(res);
    logger.info("User logged out");

    return res.status(StatusCode.OK).json({
      success: true,
      message: AUTH_MESSAGES.LOGOUT_SUCCESS,
    });
  });

  verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    const response = await this._userAuthService.verifyOtp(req, {
      email,
      otp,
    });

    setAuthCookies(res, response.refreshToken);

    return res.status(StatusCode.CREATED).json({
      success: true,
      message: AUTH_MESSAGES.OTP_VERIFIED_SUCCESS,
      data: {
        accessToken: response.accessToken,
      },
    });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const response = await this._userAuthService.login({
      email,
      password,
    });

    setAuthCookies(res, response.refreshToken);

    return res.status(StatusCode.OK).json({
      success: true,
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      data: {
        activeRole: response.activeRole,
        isProfileCompleted: response.isProfileCompleted,
        accessToken: response.accessToken,
      },
    });
  });

  googleAuth = asyncHandler(async (req: Request, res: Response) => {
    const { credential } = req.body;

    const response = await this._userAuthService.googleAuth({ credential });

    setAuthCookies(res, response.refreshToken);

    return res.status(StatusCode.OK).json({
      success: true,
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      data: {
        activeRole: response.activeRole,
        isProfileCompleted: response.isProfileCompleted,
        accessToken: response.accessToken,
      },
    });
  });

  switchRole = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;

    const response = await this._userAuthService.switchRole(userId, req.body);

    setAuthCookies(res, response.refreshToken);

    return res.status(StatusCode.OK).json({
      success: true,
      message: AUTH_MESSAGES.ROLE_SWITCH_SUCCESS,
      data: {
        accessToken: response.accessToken,
      },
    });
  });
}
