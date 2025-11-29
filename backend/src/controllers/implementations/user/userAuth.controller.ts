import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { IUserAuthService } from "../../../services/interfaces/user/IUserAuthService";
import { IUserAuthController } from "../../interfaces/user/IUserAuthController";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { asyncHandler } from "../../../utils/asyncHandler";
import { setAuthCookies, clearAuthCookies } from "../../../utils/jwt";

@injectable()
export class UserAuthController implements IUserAuthController {
  
  constructor(@inject(TYPES.IUserAuthService) private _userAuthService: IUserAuthService ) {}
  
  
  signup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, email, password, confirmPassword, role } = req.body;
    logger.info(`User registration attempt - Email: ${email}`);
    const response = await this._userAuthService.signup(req,{fullName,email,password,confirmPassword,role});
    res.status(StatusCode.OK).json({success: true,message: response.message,});
  });

  
  verifyOtp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body
    logger.info(`OTP verification attempt - Email: ${email} -OTP ${otp}`);
    const response = await this._userAuthService.verifyOtp(req,{email,otp});
    setAuthCookies(res, response.refreshToken);
    res.status(StatusCode.CREATED).json({success: true,message: response.message,accessToken:response.accessToken,role:response.role});
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
    res.status(StatusCode.CREATED).json({ success: true, message: "Google login successful", user: response.user, accessToken: response.accessToken, });
  });
  
  forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    logger.info(`Forgot password request - Email: ${email}`);
    const response = await this._userAuthService.requestPasswordReset(email);
    res.status(StatusCode.OK).json({ success: true, message: response.message });
  });
  
  resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { token, password } = req.body;
    if (!password) throw new Error("Password is required");
    const response = await this._userAuthService.resetPassword(token, password);
    res.status(200).json({ success: true, message: response.message });
  });
  
  
  getMe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    const user = await this._userAuthService.getMe(req.user.userId);
    return res.status(200).json({ success: true, user });
  });


  googleSignin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { credential } = req.body;
    const response = await this._userAuthService.googleSignin({ credential });
    setAuthCookies(res, response.refreshToken);
    res.status(200).json({
      success: true,
      user: response.user,
      accessToken: response.accessToken,
    });
  })
  
  logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    clearAuthCookies(res);
    logger.info(`User logged out`);
    res.status(StatusCode.OK).json({ success: true, message: "Logged out successfully" });
  });


}

