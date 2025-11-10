import { inject, injectable } from "inversify";
import bcrypt from "bcryptjs";
import { INutritionistAuthService } from "../../interfaces/nutritionist/INutritionistAuthService";
import { IUserRepository } from "../../../repositories/interfaces/user/IUserRepository";
import { INutritionistDetailsRepository } from "../../../repositories/interfaces/nutritionist/INutritionistDetailsRepository";
import { IOTPService } from "../../interfaces/IOtpService";
import { TYPES } from "../../../types/types";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { validateDto } from "../../../middlewares/validateDto.middleware";
import { ResendOtpDto, UserRegisterDto, VerifyOtpDto } from "../../../dtos/user/UserAuth.dto";
import { generateTokens } from "../../../utils/jwt";
import { Types } from "mongoose";
import { IAdminNotificationService } from "../../interfaces/INotificationService";
import { IAdminRepository } from "../../../repositories/interfaces/admin/IAdminRepository";
import { NotificationDto } from "../../../dtos/common/notification.dto";
import { IAdminNotificationRepository } from "../../../repositories/interfaces/INotificationRepository";


@injectable()
export class NutritionistAuthService implements INutritionistAuthService {
  constructor(
    @inject(TYPES.IUserRepository) private  _nutritionistRepository: IUserRepository,
    @inject(TYPES.IOTPService) private _otpService: IOTPService,
    @inject(TYPES.IAdminRepository) private _adminRepository : IAdminRepository,
    @inject(TYPES.IAdminNotificationRepository) private _adminNotificationService : IAdminNotificationRepository,
    @inject(TYPES.INutritionistDetailsRepository) private _nutritionistDetailsRepository: INutritionistDetailsRepository,
  ) {}

    async signup(req: Request, data: UserRegisterDto): Promise<{ message: string }> {
      await validateDto(UserRegisterDto, data);
      const { fullName, email, phone, password } = data;
      logger.info(`Signup request initiated for ${email}`);
      const existingUser = await this._nutritionistRepository.findByEmail(email);
      if (existingUser) {
        throw new CustomError("User already exists", 409);
      }
      req.session.tempUser = { fullName, email, phone, password };
      const response = await this._otpService.requestOtp(email);
      logger.info(`OTP sent successfully for ${email}`);
      return { message: "OTP sent successfully. Please verify your email." };
    }

  async verifyOtp(req: Request, data: VerifyOtpDto): Promise<{ message: string; accessToken: string,refreshToken:string }>{
    await validateDto(VerifyOtpDto, data);
    const { email, otp } = data;
    logger.info(`Verifying OTP for ${email}`);
    const isValid = await this._otpService.verifyOtp(email, otp);
    if (!isValid) {
      throw new CustomError("Invalid or expired OTP", StatusCode.BAD_REQUEST);
    }
    const tempUser = req.session.tempUser; 
    if (!tempUser) {
      throw new CustomError("Temporary user data not found", StatusCode.NOT_FOUND);
    }
    const hashedPassword = await bcrypt.hash(tempUser.password, 10);
     const newUser = await this._nutritionistRepository.createUser({
      fullName: tempUser.fullName,
      email: tempUser.email,
      phone: tempUser.phone,
      password: hashedPassword,
      isVerified: true,
      role:"nutritionist",
    });
    logger.info(`Nutritionist verified and registered successfully: ${email}`);
    const { accessToken, refreshToken } = generateTokens(newUser._id.toString(), newUser.role || "nutritionist");
    delete req.session.tempUser
    return { message: "Signup successful",accessToken, refreshToken,};
  }

  async resendOtp(data: ResendOtpDto): Promise<{ message: string }> {
    await validateDto(ResendOtpDto, data);
    const { email } = data;
    logger.info(`Resending OTP for ${email}`);
    const existingUser = await this._nutritionistRepository.findByEmail(email);
    if (existingUser && existingUser.isVerified) {
      throw new CustomError("Account already verified", StatusCode.BAD_REQUEST);
    }
    const response = await this._otpService.requestOtp(email);
    logger.info(`New OTP sent to ${email}`);
    return { message: response };
  }
  
  async submitDetails(req: Request, userId: string): Promise<{ message: string; data: any }> {
    const { bio, videoCallRate, consultationDuration } = req.body;
    const qualification = req.body["qualification[]"] || req.body.qualification;
    const specialization = req.body["specialization[]"] || req.body.specialization;
    const languagesField = req.body["languages[]"] || req.body.languages;
    const normalizedQualification = Array.isArray(qualification) ? qualification : [qualification];
    const normalizedSpecialization = Array.isArray(specialization) ? specialization : [specialization];
    const normalizedLanguages = Array.isArray(languagesField) ? languagesField : [languagesField];
    const experiences = Object.keys(req.body)
    .filter((key) => key.startsWith("experience"))
    .reduce((acc: any[], key) => {
      const match = key.match(/experience\[(\d+)\]\[(role|organization|years)\]/);
      if (match) {
        const index = parseInt(match[1]);
        const field = match[2];
        acc[index] = acc[index] || { role: "", organization: "", years: 0 };
        acc[index][field] = field === "years" 
          ? Math.max(0, Number(req.body[key]) || 0) 
          : req.body[key];
      }
      return acc;
    }, []);
    const rate = Number(videoCallRate);
    if (isNaN(rate) || rate <= 0) throw new Error("Video Call Rate must be greater than 0");
    experiences.forEach((exp, i) => {
      if (exp.years <= 0) throw new Error(`Experience years for entry ${i + 1} must be greater than 0`);
    });
    const cv = req.file ? req.file.path : undefined;
    const userObjectId = new Types.ObjectId(userId);
    const existingDetails = await this._nutritionistDetailsRepository.findByUserId(userId);
    let result;
    if (existingDetails) {
      result = await this._nutritionistDetailsRepository.updateDetails(userId, {
        qualifications: normalizedQualification,
        specializations: normalizedSpecialization,
        experiences,
        bio,
        languages: normalizedLanguages,
        videoCallRate: rate,
        consultationDuration,
        cv,
      });
    } else {
      result = await this._nutritionistDetailsRepository.createDetails({
        userId: userObjectId,
        qualifications: normalizedQualification,
        specializations: normalizedSpecialization,
        experiences,
        bio,
        languages: normalizedLanguages,
        videoCallRate: rate,
        consultationDuration,
        cv,
      });
    }
    
    const nutritionist = await this._nutritionistRepository.findById(userId);
    if (!nutritionist) throw new Error("Nutritionist not found");
      const notification: NotificationDto = {
    title: "New Nutritionist Profile Submitted",
    message: `Nutritionist ${nutritionist.fullName} has submitted their profile. Please review and approve.`,
    type: "info",
    userId: nutritionist._id.toString(),     
  };

  await this._adminNotificationService.createNotification(notification);
  return { message: "Details saved successfully", data: result };
  }

  
}





