import { inject, injectable } from "inversify";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";

import { TYPES } from "../../../../types/types";
import { AuthProvider } from "../../../../enums/user.enum";
import { StatusCode } from "../../../../enums/statusCode.enum";

import type { ILoginService } from "../../../interfaces/user/auth/ILoginService";
import type { IUserRepository } from "../../../../repositories/interfaces/user/account/IUserRepository";

import { CustomError } from "../../../../utils/customError";
import logger from "../../../../utils/logger";
import { validateDto } from "../../../../middlewares/validateDto.middleware";
import { generateTokens } from "../../../../utils/token.util";
import { generateUniqueUsername } from "../../../../utils/username.util";

import { LoginDto } from "../../../../dtos/user/auth/login.dto";
import { GoogleAuthDto } from "../../../../dtos/user/auth/google-auth.dto";
import { AuthResponseDto } from "../../../../dtos/user/auth/auth-response.dto";

@injectable()
export class LoginService implements ILoginService {
  private readonly googleClient: OAuth2Client;

  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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
}