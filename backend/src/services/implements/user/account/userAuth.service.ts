import { inject, injectable } from "inversify";
import type { Request } from "express";
import { Types } from "mongoose";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { TYPES } from "../../../../types/types";
import { AuthProvider } from "../../../../enums/user.enum";
import { StatusCode } from "../../../../enums/statusCode.enum";

import type { IUserAuthService } from "../../../interfaces/user/IUserAuthService";
import type { IUserRepository } from "../../../../repositories/interfaces/user/account/IUserRepository";
import type { IOTPService } from "../../../interfaces/common/IOtpService";
import type { IPasswordResetRepository } from "../../../../repositories/interfaces/common/IPasswordResetRepository";
import type { INutritionistProfileRepository } from "../../../../repositories/interfaces/nutritionist/INutriProfileRepository";

import { CustomError } from "../../../../utils/customError";
import logger from "../../../../utils/logger";
import { validateDto } from "../../../../middlewares/validateDto.middleware";
import { generateTokens } from "../../../../utils/token.util";
import { generateUniqueUsername } from "../../../../utils/username.util";
import { sendResetPasswordEmail } from "../../../../utils/sendOtp";

import {
  deleteTempUser,
  getTempUser,
  setTempUser,
} from "../../../../utils/session.util";

import { UserRegisterDto } from "../../../../dtos/user/auth/signup.dto";
import { MessageResponseDto } from "../../../../dtos/user/auth/message-response.dto";
import { VerifyOtpDto } from "../../../../dtos/user/auth/verify-otp.dto";
import { VerifyOtpResponseDto } from "../../../../dtos/user/auth/verify-otp-response.dto";
import { LoginDto } from "../../../../dtos/user/auth/login.dto";
import { ResendOtpDto } from "../../../../dtos/user/auth/resend-otp.dto";
import { AuthResponseDto } from "../../../../dtos/user/auth/auth-response.dto";
import { GetMeResponseDto } from "../../../../dtos/user/auth/get-me-response.dto";
import { GoogleAuthDto } from "../../../../dtos/user/auth/google-auth.dto";
import { ForgotPasswordDto } from "../../../../dtos/user/auth/forgot-password.dto";
import { ResetPasswordDto } from "../../../../dtos/user/auth/reset-password.dto";
import { SwitchRoleDto } from "../../../../dtos/user/auth/switch-role.dto";

@injectable()
export class UserAuthService implements IUserAuthService {
  private readonly googleClient: OAuth2Client;

  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,

    @inject(TYPES.IOTPService)
    private readonly otpService: IOTPService,

    @inject(TYPES.IPasswordResetRepository)
    private readonly passwordResetRepository: IPasswordResetRepository,

    @inject(TYPES.INutritionistProfileRepository)
    private readonly nutritionistRepository: INutritionistProfileRepository,
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async signup(
    req: Request,
    data: UserRegisterDto,
  ): Promise<MessageResponseDto> {
    await validateDto(UserRegisterDto, data);

    const { fullName, email, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      throw new CustomError("Passwords do not match", StatusCode.BAD_REQUEST);
    }

    logger.info("Signup request", { email });

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

    return {
      message: "OTP sent successfully. Please verify your email.",
    };
  }

  async verifyOtp(
    req: Request,
    data: VerifyOtpDto,
  ): Promise<VerifyOtpResponseDto> {
    await validateDto(VerifyOtpDto, data);

    const { email, otp } = data;

    logger.info("Verifying signup OTP", { email });

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

    logger.info("Signup successful", {
      userId: newUser._id.toString(),
    });

    return {
      message: "Signup successful",
      accessToken,
      refreshToken,
    };
  }

  async resendOtp(data: ResendOtpDto): Promise<MessageResponseDto> {
    await validateDto(ResendOtpDto, data);

    const { email } = data;

    logger.info("Resend signup OTP request", { email });

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new CustomError(
        "An account with this email already exists.",
        StatusCode.CONFLICT,
      );
    }

    await this.otpService.requestOtp(email);

    return {
      message: "OTP sent successfully.",
    };
  }

  async login(data: LoginDto): Promise<AuthResponseDto> {
    await validateDto(LoginDto, data);

    const { email, password } = data;

    logger.info("Login request", { email });

    const user = await this.userRepository.findByEmailWithPassword(email);

    if (!user || user.deletedAt) {
      throw new CustomError(
        "Invalid email or password.",
        StatusCode.UNAUTHORIZED,
      );
    }

    if (user.isBlocked) {
      throw new CustomError(
        "Your account has been blocked. Please contact support.",
        StatusCode.FORBIDDEN,
      );
    }

    if (user.authProvider === AuthProvider.GOOGLE) {
      throw new CustomError(
        "This account uses Google Sign-In.",
        StatusCode.BAD_REQUEST,
      );
    }

    if (!user.password) {
      throw new CustomError(
        "Password authentication is unavailable for this account.",
        StatusCode.UNAUTHORIZED,
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new CustomError(
        "Invalid email or password.",
        StatusCode.UNAUTHORIZED,
      );
    }

    const { accessToken, refreshToken } = generateTokens(
      user._id.toString(),
      user.activeRole,
    );

    logger.info("Login successful", {
      userId: user._id.toString(),
    });

    return {
      message: "Login successful",
      accessToken,
      refreshToken,
      activeRole: user.activeRole,
      isProfileCompleted: user.isProfileCompleted,
    };
  }

  async googleAuth(data: GoogleAuthDto): Promise<AuthResponseDto> {
    await validateDto(GoogleAuthDto, data);

    const { credential } = data;
    const audience = process.env.GOOGLE_CLIENT_ID;

    if (!audience) {
      logger.error("Google authentication is not configured.");

      throw new CustomError(
        "Google authentication is temporarily unavailable.",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    let payload;

    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: credential,
        audience,
      });

      payload = ticket.getPayload();
    } catch {
      throw new CustomError(
        "Invalid or expired Google credential.",
        StatusCode.UNAUTHORIZED,
      );
    }

    if (
      !payload ||
      !payload.sub ||
      !payload.email ||
      payload.email_verified !== true
    ) {
      throw new CustomError(
        "Google account verification failed.",
        StatusCode.UNAUTHORIZED,
      );
    }

    const email = payload.email.toLowerCase();

    logger.info("Google authentication request", { email });

    let user = await this.userRepository.findByEmail(email);

    if (user) {
      if (user.deletedAt) {
        throw new CustomError(
          "This account is no longer available.",
          StatusCode.FORBIDDEN,
        );
      }

      if (user.isBlocked) {
        throw new CustomError(
          "Your account has been blocked. Please contact support.",
          StatusCode.FORBIDDEN,
        );
      }

      if (user.googleId !== payload.sub) {
        throw new CustomError(
          "This email is already registered. Sign in using your existing authentication method.",
          StatusCode.CONFLICT,
        );
      }
    } else {
      const fullName = payload.name?.trim() || "Google User";
      const username = await generateUniqueUsername(fullName);

      user = await this.userRepository.create({
        fullName,
        email,
        username,
        googleId: payload.sub,
        ...(payload.picture ? { profileImage: payload.picture } : {}),
        authProvider: AuthProvider.GOOGLE,
        emailVerifiedAt: new Date(),
      });
    }

    const { accessToken, refreshToken } = generateTokens(
      user._id.toString(),
      user.activeRole,
    );

    logger.info("Google authentication successful", {
      userId: user._id.toString(),
    });

    return {
      message: "Google authentication successful",
      accessToken,
      refreshToken,
      activeRole: user.activeRole,
      isProfileCompleted: user.isProfileCompleted,
    };
  }

  async requestPasswordReset(
    data: ForgotPasswordDto,
  ): Promise<MessageResponseDto> {
    await validateDto(ForgotPasswordDto, data);

    const { email } = data;

    logger.info("Password reset request", { email });

    const user = await this.userRepository.findByEmail(email);

    if (!user || user.deletedAt) {
      throw new CustomError("User not found.", StatusCode.NOT_FOUND);
    }

    if (user.isBlocked) {
      throw new CustomError(
        "Your account has been blocked. Please contact support.",
        StatusCode.FORBIDDEN,
      );
    }

    if (user.authProvider === AuthProvider.GOOGLE) {
      throw new CustomError(
        "This account uses Google Sign-In.",
        StatusCode.BAD_REQUEST,
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    await this.passwordResetRepository.deleteUserResetTokens(
      user._id.toString(),
    );

    await this.passwordResetRepository.createResetToken(
      user._id.toString(),
      hashedToken,
      new Date(Date.now() + 60 * 60 * 1000),
    );

    const frontendUrl = process.env.FRONTEND_URL;

    if (!frontendUrl) {
      logger.error("FRONTEND_URL is not configured.");

      throw new CustomError(
        "Password reset is temporarily unavailable.",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    await sendResetPasswordEmail(user.email, resetLink);

    return {
      message: "Password reset link sent successfully.",
    };
  }

  async resetPassword(data: ResetPasswordDto): Promise<MessageResponseDto> {
    await validateDto(ResetPasswordDto, data);

    const { token, newPassword, confirmPassword } = data;

    if (newPassword !== confirmPassword) {
      throw new CustomError("Passwords do not match.", StatusCode.BAD_REQUEST);
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const resetToken =
      await this.passwordResetRepository.findResetToken(hashedToken);

    if (!resetToken) {
      throw new CustomError(
        "Invalid or expired reset link.",
        StatusCode.BAD_REQUEST,
      );
    }

    const userId = resetToken.userId.toString();

    const user = await this.userRepository.findById(userId);

    if (!user || user.deletedAt) {
      throw new CustomError(
        "This account is no longer available.",
        StatusCode.BAD_REQUEST,
      );
    }

    if (user.isBlocked) {
      throw new CustomError(
        "Your account has been blocked. Please contact support.",
        StatusCode.FORBIDDEN,
      );
    }

    if (user.authProvider === AuthProvider.GOOGLE) {
      throw new CustomError(
        "This account uses Google Sign-In.",
        StatusCode.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.userRepository.updatePasswordById(userId, hashedPassword);

    await this.passwordResetRepository.deleteResetToken(hashedToken);

    return {
      message: "Password reset successfully.",
    };
  }

  async getMe(userId: string): Promise<GetMeResponseDto> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid user ID.", StatusCode.BAD_REQUEST);
    }

    const user = await this.userRepository.findById(userId);

    if (!user || user.deletedAt) {
      throw new CustomError("User not found.", StatusCode.NOT_FOUND);
    }

    if (user.isBlocked) {
      throw new CustomError(
        "Your account has been blocked. Please contact support.",
        StatusCode.FORBIDDEN,
      );
    }

    const nutritionist = await this.nutritionistRepository.findByUserId(userId);

    return {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      username: user.username,
      profileImage: user.profileImage ?? null,
      activeRole: user.activeRole,
      roles: user.roles,
      isProfileCompleted: user.isProfileCompleted,
      nutritionistStatus: nutritionist?.applicationStatus ?? null,
    };
  }

  async switchRole(
    userId: string,
    dto: SwitchRoleDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const validatedDto = await validateDto(SwitchRoleDto, dto);

    if (!Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid user ID.", StatusCode.BAD_REQUEST);
    }

    const user = await this.userRepository.findById(userId);

    if (!user || user.deletedAt) {
      throw new CustomError("User not found.", StatusCode.NOT_FOUND);
    }

    if (user.isBlocked) {
      throw new CustomError(
        "Your account has been blocked. Please contact support.",
        StatusCode.FORBIDDEN,
      );
    }

    if (!user.roles.includes(validatedDto.role)) {
      throw new CustomError(
        "You do not have access to this role.",
        StatusCode.FORBIDDEN,
      );
    }

    await this.userRepository.updateById(userId, {
      activeRole: validatedDto.role,
    });

    const { accessToken, refreshToken } = generateTokens(
      userId,
      validatedDto.role,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
