import { inject, injectable } from "inversify";
import type { Request } from "express";
import bcrypt from "bcryptjs";

import { TYPES } from "../../../../types/types";
import { AuthProvider } from "../../../../enums/user.enum";
import { StatusCode } from "../../../../enums/statusCode.enum";

import type { ISignupService } from "../../../interfaces/user/auth/ISignupService";
import type { IUserRepository } from "../../../../repositories/interfaces/user/account/IUserRepository";
import type { IOTPService } from "../../../interfaces/common/IOtpService";

import { CustomError } from "../../../../utils/customError";
import logger from "../../../../utils/logger";
import { validateDto } from "../../../../middlewares/validateDto.middleware";
import { generateTokens } from "../../../../utils/token.util";
import { generateUniqueUsername } from "../../../../utils/username.util";
import {
  deleteTempUser,
  getTempUser,
  setTempUser,
} from "../../../../utils/session.util";

import { UserRegisterDto } from "../../../../dtos/user/auth/signup.dto";
import { VerifyOtpDto } from "../../../../dtos/user/auth/verify-otp.dto";
import { VerifyOtpResponseDto } from "../../../../dtos/user/auth/verify-otp-response.dto";
import { ResendOtpDto } from "../../../../dtos/user/auth/resend-otp.dto";

@injectable()
export class SignupService implements ISignupService {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,

    @inject(TYPES.IOTPService)
    private readonly otpService: IOTPService,
  ) {}

  async signup(req: Request, data: UserRegisterDto): Promise<void> {
    const { fullName, email, password, confirmPassword } = await validateDto(
      UserRegisterDto,
      data,
    );

    if (password !== confirmPassword) {
      throw new CustomError("Passwords do not match", StatusCode.BAD_REQUEST);
    }

    logger.info("User signup initiated", {
      email: email.replace(/^(.{2}).*(@.*)$/, "$1***$2"),
    });

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new CustomError(
        "An account with this email already exists.",
        StatusCode.CONFLICT,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    setTempUser(req, {
      fullName,
      email,
      password: hashedPassword,
    });

    await this.otpService.requestOtp(email);

    logger.info("Signup OTP sent successfully", {
      email: email.replace(/^(.{2}).*(@.*)$/, "$1***$2"),
    });
  }

  async verifyOtp(
    req: Request,
    data: VerifyOtpDto,
  ): Promise<VerifyOtpResponseDto> {
    const { email, otp } = await validateDto(VerifyOtpDto, data);

    logger.info("Signup OTP verification initiated");

    const tempUser = getTempUser(req);

    if (!tempUser) {
      throw new CustomError(
        "Signup session expired. Please sign up again.",
        StatusCode.BAD_REQUEST,
      );
    }

    if (tempUser.email.toLowerCase() !== email.toLowerCase()) {
      throw new CustomError(
        "The email does not match the signup session.",
        StatusCode.BAD_REQUEST,
      );
    }

    await this.otpService.verifyOtp(email, otp);

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new CustomError(
        "An account with this email already exists.",
        StatusCode.CONFLICT,
      );
    }

    const username = await generateUniqueUsername(tempUser.fullName);

    const newUser = await this.userRepository.create({
      fullName: tempUser.fullName,
      email: tempUser.email,
      username,
      password: tempUser.password,
      authProvider: AuthProvider.LOCAL,
      emailVerifiedAt: new Date(),
    });

    const { accessToken, refreshToken } = generateTokens(
      newUser._id.toString(),
      newUser.activeRole,
    );

    deleteTempUser(req);

    logger.info("User signup completed successfully", {
      userId: newUser._id.toString(),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async resendOtp(data: ResendOtpDto): Promise<void> {
    const { email } = await validateDto(ResendOtpDto, data);

    logger.info("Signup OTP resend initiated");

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new CustomError(
        "An account with this email already exists.",
        StatusCode.CONFLICT,
      );
    }

    await this.otpService.requestOtp(email);

    logger.info("Signup OTP resent successfully");
  }
}
