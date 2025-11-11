import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { IUserAuthService } from "../../../services/interfaces/user/IUserAuthService";
import { IUserAuthController } from "../../interfaces/user/IUserAuthController";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { asyncHandler } from "../../../utils/asyncHandler";
import { OAuth2Client } from "google-auth-library";
import { setAuthCookies } from "../../../utils/jwt";

@injectable()
export class UserAuthController implements IUserAuthController {
  
  constructor(@inject(TYPES.IUserAuthService) private _userAuthService: IUserAuthService ) {}
  
  
  register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, email, phone, password, confirmPassword } = req.body;
    logger.info(`User registration attempt - Email: ${email}`);
    const response = await this._userAuthService.signup(req,{fullName,email,phone,password,confirmPassword,});
    res.status(StatusCode.OK).json({success: true,message: response.message});
  });

  
  verifyOtp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body
    logger.info(`OTP verification attempt - Email: ${email} -OTP ${otp}`);
    const response = await this._userAuthService.verifyOtp(req,{email,otp});
    setAuthCookies(res, response.refreshToken);
    res.status(StatusCode.CREATED).json({success: true,message: response.message,accessToken:response.accessToken,});
  });
  

  resendOtp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    logger.info(`Registration attempt - Email: ${email}`);
    const response = await this._userAuthService.resendOtp({email})
    res.status(StatusCode.OK).json({success: true,message: response.message});
  });

  login = asyncHandler(async (req:Request, res:Response, next:NextFunction)=> {
    const {email,password} = req.body;
    logger.info(`Login attempt - Email: ${email}`);
    const response = await this._userAuthService.login({email,password})
    setAuthCookies(res, response.refreshToken);
    res.status(StatusCode.CREATED).json({success: true,user:response.user,accessToken:response.accessToken,});
  })
  
  
  googleLogin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { credential, role } = req.body;
    logger.info(`Google login attempt - Role: ${role}`);
    const response = await this._userAuthService.googleLogin({ credential, role });
    setAuthCookies(res, response.refreshToken);
    res.status(StatusCode.CREATED).json({
      success: true,
      user: response.user,
      accessToken: response.accessToken,
    });
  });

  forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  logger.info(`Forgot password request - Email: ${email}`);
  const response = await this._userAuthService.requestPasswordReset(email);
  res.status(StatusCode.OK).json({ success: true, message: response.message });
});


resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;
  if (!password) throw new Error("Password is required");
  const response = await this._userAuthService.resetPassword(token, password);
  res.status(200).json({ success: true, message: response.message });
});
  
}

