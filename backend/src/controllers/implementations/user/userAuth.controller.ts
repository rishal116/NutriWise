import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { IUserAuthService } from "../../../services/interfaces/user/IUserAuthService";
import { IUserAuthController } from "../../interfaces/user/IUserAuthController";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { asyncHandler } from "../../../utils/asyncHandler";
import { setAuthCookies, clearAuthCookies } from "../../../utils/jwt";
import {
  AUTH_MESSAGES,
  USER_MESSAGES,
  COMMON_MESSAGES,
} from "../../../constants";

@injectable()
export class UserAuthController implements IUserAuthController {
  constructor(
    @inject(TYPES.IUserAuthService)
    private _userAuthService: IUserAuthService,
  ) {}

  signup = asyncHandler(async (req: Request, res: Response) => {
    const { fullName, email, password, confirmPassword, role } = req.body;
    const response = await this._userAuthService.signup(req, {
      fullName,
      email,
      password,
      confirmPassword,
      role,
    });
    return res.status(StatusCode.OK).json({
      success: true,
      message: response.message,
    });
  });

  verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const response = await this._userAuthService.verifyOtp(req, { email, otp });
    setAuthCookies(res, response.refreshToken);
    return res.status(StatusCode.CREATED).json({
      success: true,
      message: USER_MESSAGES.OTP_VERIFIED,
      accessToken: response.accessToken,
      role: response.role,
    });
  });

  resendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    await this._userAuthService.resendOtp({ email });
    return res.status(StatusCode.OK).json({
      success: true,
      message: USER_MESSAGES.OTP_SENT,
    });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const response = await this._userAuthService.login({ email, password });
    setAuthCookies(res, response.refreshToken);
    return res.status(StatusCode.OK).json({
      success: true,
      user: response.user,
      accessToken: response.accessToken,
    });
  });

  googleLogin = asyncHandler(async (req: Request, res: Response) => {
    const { credential, role } = req.body;
    const response = await this._userAuthService.googleLogin({
      credential,
      role,
    });
    setAuthCookies(res, response.refreshToken);
    return res.status(StatusCode.CREATED).json({
      success: true,
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      user: response.user,
      accessToken: response.accessToken,
    });
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    await this._userAuthService.requestPasswordReset(email);
    return res.status(StatusCode.OK).json({
      success: true,
      message: COMMON_MESSAGES.SUCCESS,
    });
  });

  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, password } = req.body;
    await this._userAuthService.resetPassword(token, password);
    return res.status(StatusCode.OK).json({
      success: true,
      message: COMMON_MESSAGES.UPDATED,
    });
  });

  getMe = asyncHandler(async (req: Request, res: Response) => {
    const user = await this._userAuthService.getMe(req.user!.userId);
    return res.status(StatusCode.OK).json({
      success: true,
      user,
    });
  });

  googleSignin = asyncHandler(async (req: Request, res: Response) => {
    const { credential } = req.body;
    const response = await this._userAuthService.googleSignin({ credential });
    setAuthCookies(res, response.refreshToken);
    return res.status(StatusCode.OK).json({
      success: true,
      user: response.user,
      accessToken: response.accessToken,
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
