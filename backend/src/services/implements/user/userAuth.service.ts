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
import {
  ResendOtpDto,
  UserRegisterDto,
  VerifyOtpDto,
  LoginDto,
} from "../../../dtos/user/UserAuth.dto";
import { generateTokens } from "../../../utils/jwt";
import crypto from "crypto";
import { sendResetPasswordEmail } from "../../../utils/sendOtp";
import {
  SignupResponseDto,
  GoogleLoginRequestDto,
  MessageResponseDto,
  GetMeResponseDto,
  AuthSuccessResponse,
} from "../../../dtos/user/userAuth.response.dto";
import {
  mapUserToSafeUserDto,
  mapUserToGetMeDto,
  UserEntity,
} from "../../../mapper/user/userAuth.mapper";
import { INutritionistProfileRepository } from "../../../repositories/interfaces/nutritionist/INutritionistProfileRepository";
import { UserRole } from "../../../models/user.model";

type TempUserSession = {
  fullName: string;
  email: string;
  password: string;
};

const getTempUser = (req: Request): TempUserSession | undefined => {
  const sessionObj = req.session as unknown as { tempUser?: TempUserSession };
  return sessionObj.tempUser;
};

const deleteTempUser = (req: Request) => {
  const sessionObj = req.session as unknown as { tempUser?: TempUserSession };
  delete sessionObj.tempUser;
};

@injectable()
export class UserAuthService implements IUserAuthService {
  private _googleClient: OAuth2Client;

  constructor(
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.IOTPService) private _otpService: IOTPService,
    @inject(TYPES.INutritionistProfileRepository)
    private _nutritionistProfileRepository: INutritionistProfileRepository,
  ) {
    this._googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async signup(
    req: Request,
    data: UserRegisterDto,
  ): Promise<SignupResponseDto> {
    await validateDto(UserRegisterDto, data);
    const { fullName, email, password } = data;
    logger.info("Signup request", { email });
    const existingUser = await this._userRepository.findByEmail(email);
    if (existingUser) {
      throw new CustomError("User already exists", StatusCode.CONFLICT);
    }
    (req.session as { tempUser?: TempUserSession }).tempUser = {
      fullName,
      email,
      password,
    };
    await this._otpService.requestOtp(email);
    return {
      success: true,
      message: "OTP sent successfully. Please verify your email.",
    };
  }

  async verifyOtp(
    req: Request,
    data: VerifyOtpDto,
  ): Promise<AuthSuccessResponse> {
    await validateDto(VerifyOtpDto, data);
    const { email, otp } = data;
    logger.info("Verify OTP", { email });
    const isValid = await this._otpService.verifyOtp(email, otp);
    if (!isValid) {
      throw new CustomError("Invalid or expired OTP", StatusCode.BAD_REQUEST);
    }
    const tempUser = getTempUser(req);
    if (!tempUser) {
      throw new CustomError(
        "Temporary user data not found",
        StatusCode.NOT_FOUND,
      );
    }
    const hashedPassword = await bcrypt.hash(tempUser.password, 10);
    const newUser = (await this._userRepository.create({
      fullName: tempUser.fullName,
      email: tempUser.email,
      password: hashedPassword,
      roles: ["client"],
      activeRole: "client",
    })) as unknown as UserEntity;

    const { accessToken, refreshToken } = generateTokens(
      String(newUser._id),
      (newUser.activeRole as UserRole) || "client",
      (newUser.roles as UserRole[]) || ["client"],
    );

    deleteTempUser(req);
    return {
      success: true,
      message: "Signup successful",
      accessToken,
      refreshToken,
      user: mapUserToSafeUserDto(newUser),
    };
  }

  async resendOtp(data: ResendOtpDto): Promise<MessageResponseDto> {
    await validateDto(ResendOtpDto, data);
    const { email } = data;
    logger.info("Resend OTP request", { email });
    const existingUser = await this._userRepository.findByEmail(email);
    if (existingUser) {
      throw new CustomError("Account already verified", StatusCode.BAD_REQUEST);
    }
    await this._otpService.requestOtp(email);
    return {
      success: true,
      message: "OTP resent successfully. Please check your email.",
    };
  }

  async login(data: LoginDto): Promise<AuthSuccessResponse> {
    await validateDto(LoginDto, data);
    const { email, password } = data;
    logger.info("Login request received", { email });
    const user = (await this._userRepository.findByEmail(email)) as
      | (UserEntity & { password?: string })
      | null;
    if (!user) {
      throw new CustomError("User not found", StatusCode.NOT_FOUND);
    }
    if (!user.password) {
      throw new CustomError(
        "This account is registered with Google. Please login with Google",
        StatusCode.BAD_REQUEST,
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new CustomError("Invalid password", StatusCode.UNAUTHORIZED);
    }
    const { accessToken, refreshToken } = generateTokens(
      String(user._id),
      (user.activeRole as UserRole) || "client",
      (user.roles as UserRole[]) || ["client"],
    );

    return {
      success: true,
      message: "Login successful",
      user: mapUserToSafeUserDto(user),
      accessToken,
      refreshToken,
    };
  }

  async googleAuth(
    payload: GoogleLoginRequestDto,
  ): Promise<AuthSuccessResponse> {
    const { credential } = payload;

    logger.info("Google authentication request received");

    const ticket = await this._googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const googlePayload = ticket.getPayload();

    if (!googlePayload) {
      throw new CustomError("Invalid Google token", StatusCode.BAD_REQUEST);
    }

    const email = googlePayload.email;
    const googleId = googlePayload.sub;

    if (!email || !googleId) {
      throw new CustomError(
        "Google account information is incomplete",
        StatusCode.BAD_REQUEST,
      );
    }

    let user = (await this._userRepository.findByEmail(
      email,
    )) as UserEntity | null;

    if (!user) {
      logger.info("Creating new Google user", { email });

      user = (await this._userRepository.create({
        fullName: googlePayload.name || "",
        email,
        googleProviderId: googleId,

        roles: ["client"],
        activeRole: "client",
      })) as UserEntity;
    } else if (!user.googleProviderId) {
      logger.info("Linking Google account to existing user", {
        email,
      });

      await this._userRepository.updateGoogleProviderId(email, googleId);

      user.googleProviderId = googleId;
    }

    if (user.isBlocked) {
      throw new CustomError(
        "Your account has been blocked. Please contact support.",
        StatusCode.FORBIDDEN,
      );
    }

    const { accessToken, refreshToken } = generateTokens(
      String(user._id),
      (user.activeRole as UserRole) || "client",
      (user.roles as UserRole[]) || ["client"],
    );

    logger.info("Google authentication successful", {
      email,
      userId: user._id,
    });

    return {
      success: true,
      message: "Google authentication successful",
      user: mapUserToSafeUserDto(user),
      accessToken,
      refreshToken,
    };
  }

  async requestPasswordReset(email: string): Promise<MessageResponseDto> {
    logger.info("Password reset request", { email });
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new CustomError("User not found", StatusCode.NOT_FOUND);
    }
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await this._userRepository.setResetToken(email, hashedToken, expires);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    logger.info("Password reset link generated", { email });
    await sendResetPasswordEmail(email, resetLink);
    return {
      success: true,
      message: "Password reset link sent successfully to your email.",
    };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<MessageResponseDto> {
    logger.info("Reset password request received");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await this._userRepository.findByResetToken(hashedToken);
    if (!user) {
      throw new CustomError("Invalid or expired token", StatusCode.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this._userRepository.updatePasswordByEmail(
      user.email,
      hashedPassword,
    );
    await this._userRepository.setResetToken(user.email, "", new Date(0));
    logger.info("Password reset successful", {
      email: user.email,
    });

    return {
      success: true,
      message: "Password reset successfully.",
    };
  }

  async getMe(userId: string): Promise<GetMeResponseDto> {
    logger.info("Fetching current user profile", {
      userId,
    });

    const user = (await this._userRepository.findById(
      userId,
    )) as UserEntity | null;

    if (!user) {
      throw new CustomError("User not found", StatusCode.NOT_FOUND);
    }
    const nutritionistProfile =
      await this._nutritionistProfileRepository.findByUserId(userId);

    const nutritionistStatus =
      nutritionistProfile?.verificationStatus || "none";

    return mapUserToGetMeDto({
      ...user,
      nutritionistStatus,
    });
  }

  async switchRole(
    userId: string,
    activeRole: UserRole,
  ): Promise<AuthSuccessResponse> {
    logger.info("Switch role request", {
      userId,
      activeRole,
    });

    const user = (await this._userRepository.findById(
      userId,
    )) as UserEntity | null;

    if (!user) {
      throw new CustomError("User not found", StatusCode.NOT_FOUND);
    }

    // ✅ Ensure requested role exists for user
    if (!user.roles?.includes(activeRole)) {
      throw new CustomError(
        "You are not authorized for this role",
        StatusCode.FORBIDDEN,
      );
    }

    // ✅ Update active role
    const updatedUser = (await this._userRepository.updateById(userId, {
      activeRole,
    })) as UserEntity | null;

    if (!updatedUser) {
      throw new CustomError(
        "Failed to switch role",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    // ✅ Generate fresh tokens with new role
    const { accessToken, refreshToken } = generateTokens(
      String(updatedUser._id),
      updatedUser.activeRole as UserRole,
      (updatedUser.roles as UserRole[]) || ["client"],
    );

    logger.info("Role switched successfully", {
      userId,
      activeRole,
    });

    return {
      success: true,
      message: "Role switched successfully",
      user: mapUserToSafeUserDto(updatedUser),
      accessToken,
      refreshToken,
    };
  }
}
