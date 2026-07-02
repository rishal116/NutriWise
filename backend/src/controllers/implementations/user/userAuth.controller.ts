import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { IUserAuthService } from "../../../services/interfaces/user/IUserAuthService";
import { IUserAuthController } from "../../interfaces/user/IUserAuthController";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { asyncHandler } from "../../../utils/asyncHandler";
import { setAuthCookies, clearAuthCookies } from "../../../utils/jwt";
import { AUTH_MESSAGES } from "../../../constants";

@injectable()
export class UserAuthController implements IUserAuthController {
  constructor(
    @inject(TYPES.IUserAuthService)
    private _userAuthService: IUserAuthService,
  ) {}

  signup = asyncHandler(async (req: Request, res: Response) => {
    const { fullName, email, password, confirmPassword } = req.body;
    const response = await this._userAuthService.signup(req, {
      fullName,
      email,
      password,
      confirmPassword,
    });
    return res.status(StatusCode.OK).json({
      success: true,
      message: response.message,
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
      message: response.message,
      accessToken: response.accessToken,
    });
  });

  resendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const response = await this._userAuthService.resendOtp({
      email,
    });
    return res.status(StatusCode.OK).json({
      success: true,
      message: response.message,
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
      message: response.message,
      accessToken: response.accessToken,
      activeRole: response.activeRole,
      isProfileCompleted: response.isProfileCompleted,
    });
  });

  googleAuth = asyncHandler(async (req: Request, res: Response) => {
    const { credential } = req.body;
    const response = await this._userAuthService.googleAuth({
      credential,
    });
    setAuthCookies(res, response.refreshToken);
    return res.status(StatusCode.OK).json({
      success: true,
      message: response.message,
      accessToken: response.accessToken,
      activeRole: response.activeRole,
      isProfileCompleted: response.isProfileCompleted,
    });
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const response = await this._userAuthService.requestPasswordReset({
      email,
    });
    return res.status(StatusCode.OK).json({
      success: true,
      message: response.message,
    });
  });

  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword, confirmPassword } = req.body;
    const response = await this._userAuthService.resetPassword({
      token,
      newPassword,
      confirmPassword,
    });
    return res.status(StatusCode.OK).json({
      success: true,
      message: response.message,
    });
  });

  getMe = asyncHandler(async (req: Request, res: Response) => {
    const response = await this._userAuthService.getMe(req.user!.userId);
    return res.status(StatusCode.OK).json({
      success: true,
      data: response,
    });
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    clearAuthCookies(res);
    logger.info("User logged out");
    return res.status(StatusCode.OK).json({
      success: true,
      message: AUTH_MESSAGES.LOGOUT_SUCCESS,
    });
  });
}
