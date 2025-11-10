import { Request, Response, NextFunction } from "express";
import { INutritionistAuthController } from "../../interfaces/nutritionist/INutritionistAuthController";
import { INutritionistAuthService } from "../../../services/interfaces/nutritionist/INutritionistAuthService";
import { asyncHandler } from "../../../utils/asyncHandler";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { setAuthCookies } from "../../../utils/jwt";


@injectable()
export class NutritionistAuthController implements INutritionistAuthController {
  constructor(
    @inject(TYPES.INutritionistAuthService)
    private _nutritionistAuthService: INutritionistAuthService
  ) {}

  register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, email, phone, password, confirmPassword } = req.body;
    logger.info(`User registration attempt - Email: ${email}`);
    const response = await this._nutritionistAuthService.signup(req,{fullName,email,phone,password,confirmPassword,});
    res.status(StatusCode.OK).json({success: true,message: response.message});
  });

  verifyOtp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body
    logger.info(`OTP verification attempt - Email: ${email} -OTP ${otp}`);
    const response = await this._nutritionistAuthService.verifyOtp(req,{email,otp});
    setAuthCookies(res, response.refreshToken);
    res.status(StatusCode.CREATED).json({success: true,message: response.message,accessToken:response.accessToken,});
  });

  resendOtp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    logger.info(`Registration attempt - Email: ${email}`);
    const response = await this._nutritionistAuthService.resendOtp({email})
    res.status(StatusCode.OK).json({success: true,message: response.message});
  });
  
  submitDetails = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req as any;
    logger.info(`Submit details attempt - Nutritionist ID: ${user.userId}`);
    const response = await this._nutritionistAuthService.submitDetails(req, user.userId);
    res.status(StatusCode.OK).json({success: true,message: "Details submitted successfully",data: response,});
  });


}
