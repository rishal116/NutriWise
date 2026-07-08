import { injectable, inject } from "inversify";
import { Request } from "express";
import bcrypt from "bcryptjs";
import { TYPES } from "../../../types/types";
import { IUserAuthService } from "../../interfaces/user/IUserAuthService";
import { IUserRepository } from "../../../repositories/interfaces/user/IUserRepository";
import { IOTPService } from "../../interfaces/common/IOtpService";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { OAuth2Client } from "google-auth-library";
import { validateDto } from "../../../middlewares/validateDto.middleware";
import { generateTokens } from "../../../utils/token.util";
import crypto from "crypto";
import { sendResetPasswordEmail } from "../../../utils/sendOtp";
import { UserRegisterDto } from "../../../dtos/user/auth/signup.dto";
import { MessageResponseDto } from "../../../dtos/user/auth/message-response.dto";
import { VerifyOtpDto } from "../../../dtos/user/auth/verify-otp.dto";
import { VerifyOtpResponseDto } from "../../../dtos/user/auth/verify-otp-response.dto";
import { generateUniqueUsername } from "../../../utils/username.util";
import {
  deleteTempUser,
  getTempUser,
  setTempUser,
} from "../../../utils/session.util";
import { LoginDto } from "../../../dtos/user/auth/login.dto";
import { ResendOtpDto } from "../../../dtos/user/auth/resend-otp.dto";
import { AuthResponseDto } from "../../../dtos/user/auth/auth-response.dto";
import { IPasswordResetRepository } from "../../../repositories/interfaces/common/IPasswordResetRepository";
import { GetMeResponseDto } from "../../../dtos/user/get-me-response.dto";
import { GoogleAuthDto } from "../../../dtos/user/auth/google-auth.dto";
import { ForgotPasswordDto } from "../../../dtos/user/auth/forgot-password.dto";
import { ResetPasswordDto } from "../../../dtos/user/auth/reset-password.dto";
import { Types } from "mongoose";
import { INutritionistProfileRepository } from "../../../repositories/interfaces/nutritionist/INutritionistProfileRepository";
import { SwitchRoleDto } from "../../../dtos/user/auth/switch-role.dto";

@injectable()
export class UserAuthService implements IUserAuthService {
  private _googleClient: OAuth2Client;

  constructor(
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.IOTPService) private _otpService: IOTPService,
    @inject(TYPES.IPasswordResetRepository)
    private _passwordResetRepository: IPasswordResetRepository,
    @inject(TYPES.INutritionistProfileRepository)
    private _nutritionistRepository: INutritionistProfileRepository,
  ) {
    this._googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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
    const existingUser = await this._userRepository.findByEmail(email);
    if (existingUser) {
      throw new CustomError("User already exists", StatusCode.CONFLICT);
    }
    setTempUser(req, {
      fullName,
      email,
      password,
    });
    await this._otpService.requestOtp(email);
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
    logger.info("Verifying OTP", { email });
    await this._otpService.verifyOtp(email, otp);
    const tempUser = getTempUser(req);
    if (!tempUser) {
      throw new CustomError(
        "Temporary user data not found",
        StatusCode.NOT_FOUND,
      );
    }
    const hashedPassword = await bcrypt.hash(tempUser.password, 10);
    const username = await generateUniqueUsername(tempUser.fullName);
    const newUser = await this._userRepository.create({
      fullName: tempUser.fullName,
      email: tempUser.email,
      username,
      password: hashedPassword,
    });
    const { accessToken, refreshToken } = generateTokens(
      newUser._id.toString(),
      newUser.activeRole,
    );
    deleteTempUser(req);
    return {
      message: "Signup successful",
      accessToken,
      refreshToken,
    };
  }

  async resendOtp(data: ResendOtpDto): Promise<MessageResponseDto> {
    await validateDto(ResendOtpDto, data);
    const { email } = data;
    logger.info("Resend OTP request", { email });
    const user = await this._userRepository.findByEmail(email);
    if (user) {
      throw new CustomError("Account already exists", StatusCode.BAD_REQUEST);
    }
    await this._otpService.requestOtp(email);
    return {
      message: "OTP sent successfully",
    };
  }

  async login(data: LoginDto): Promise<AuthResponseDto> {
    await validateDto(LoginDto, data);
    const { email, password } = data;
    console.log(password);
    logger.info("Login request", { email });
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new CustomError("User not found", StatusCode.NOT_FOUND);
    }

    if (!user.password) {
      throw new CustomError(
        "This account is registered with Google. Please sign in with Google.",
        StatusCode.BAD_REQUEST,
      );
    }
    const hashedPassword = user.password;
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordValid) {
      throw new CustomError(
        "Invalid email or password",
        StatusCode.UNAUTHORIZED,
      );
    }
    const { accessToken, refreshToken } = generateTokens(
      user._id.toString(),
      user.activeRole,
    );
    logger.info("Login successful", {
      userId: user._id,
      email,
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
    const ticket = await this._googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.sub) {
      throw new CustomError("Invalid Google token", StatusCode.BAD_REQUEST);
    }
    let user = await this._userRepository.findByEmail(payload.email);
    if (!user) {
      const username = await generateUniqueUsername(payload.name ?? "user");
      user = await this._userRepository.create({
        fullName: payload.name ?? "",
        email: payload.email,
        username,
        googleId: payload.sub,
      });
    }
    const { accessToken, refreshToken } = generateTokens(
      user._id.toString(),
      user.activeRole,
    );
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
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new CustomError("User not found", StatusCode.NOT_FOUND);
    }
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    await this._passwordResetRepository.deleteUserResetTokens(
      user._id.toString(),
    );
    await this._passwordResetRepository.createResetToken(
      user._id.toString(),
      hashedToken,
      new Date(Date.now() + 60 * 60 * 1000),
    );
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await sendResetPasswordEmail(user.email, resetLink);
    return {
      message: "Password reset link sent successfully.",
    };
  }

  async resetPassword(data: ResetPasswordDto): Promise<MessageResponseDto> {
    await validateDto(ResetPasswordDto, data);
    const { token, newPassword, confirmPassword } = data;
    if (newPassword !== confirmPassword) {
      throw new CustomError("Passwords do not match", StatusCode.BAD_REQUEST);
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const resetToken =
      await this._passwordResetRepository.findResetToken(hashedToken);
    if (!resetToken) {
      throw new CustomError(
        "Invalid or expired reset link",
        StatusCode.BAD_REQUEST,
      );
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this._userRepository.updatePasswordById(
      resetToken.userId.toString(),
      hashedPassword,
    );
    await this._passwordResetRepository.deleteResetToken(hashedToken);
    return {
      message: "Password reset successfully.",
    };
  }

  async getMe(userId: string): Promise<GetMeResponseDto> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid user ID", StatusCode.BAD_REQUEST);
    }
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new CustomError("User not found", StatusCode.NOT_FOUND);
    }
    const nutritionist =
      await this._nutritionistRepository.findByUserId(userId);
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
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new CustomError("User not found");
    }
    if (!user.roles.includes(dto.role)) {
      throw new CustomError("You do not have access to this role");
    }
    await this._userRepository.updateById(userId, {
      activeRole: dto.role,
    });
    const { accessToken, refreshToken } = generateTokens(userId, dto.role);
    return {
      accessToken,
      refreshToken,
    };
  }
}
