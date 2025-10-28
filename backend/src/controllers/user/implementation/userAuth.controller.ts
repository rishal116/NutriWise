import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { IUserAuthService } from "../../../services/interfaces/user/IUserAuthService";
import { IOTPService } from "../../../services/interfaces/IOtpService";
import { IUserAuthController } from "../interface/IUserAuthController";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { CustomError} from "../../../utils/customError";
import { asyncHandler } from "../../../utils/asyncHandler";
import {UserRegisterDto, RequestOtpDto, VerifyOtpDto, RegisterResponseDto, LoginResponseDto, UserRoleDto, ResendOtpDto} from "../../../dtos/user/UserAuth.dtos";
import { OAuth2Client } from "google-auth-library";

@injectable()
export class UserAuthController implements IUserAuthController {
  private _googleClient: OAuth2Client;

  constructor(
    @inject(TYPES.IUserAuthService) private _userAuthService: IUserAuthService,
    @inject(TYPES.IOTPService) private _otpService: IOTPService,
  ) {
    this._googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }
  
  register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const registerDto = req.body as UserRegisterDto;
    const { email } = registerDto;
    logger.info(`Registration attempt - Email: ${email}`);
    await this._userAuthService.signup(registerDto);
    const response = new RegisterResponseDto(true, "OTP sent to your email for verification");
    res.status(StatusCode.OK).json(response);
  });
  
  verifyOtp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const verifyOtpDto = req.body as VerifyOtpDto;
    const { email, otp } = verifyOtpDto;
    logger.info(`OTP verification attempt - Email: ${email} -OTP ${otp}`);
    await this._userAuthService.verifyOtp(verifyOtpDto);
    const response = new LoginResponseDto(true, "Account created successfully");
    res.status(StatusCode.CREATED).json(response);
  });

    resendOtp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const registerDto = req.body as ResendOtpDto;
    const { email } = registerDto;
    logger.info(`Registration attempt - Email: ${email}`);
    await this._otpService.requestOtp(email);
    const response = new RegisterResponseDto(true, "OTP sent to your email for verification");
    res.status(StatusCode.OK).json(response);
  });

  
  selectRole = asyncHandler(async (req: Request, res: Response) => {
    const { email, role } = req.body;
    const result = await this._userAuthService.selectUserRole({ email, role });
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(StatusCode.OK)
    .json({
      success: true,
      message: "Role selected successfully",
    });
  });


}



