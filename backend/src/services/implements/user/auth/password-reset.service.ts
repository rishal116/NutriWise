import { inject, injectable } from "inversify";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { TYPES } from "../../../../types/types";
import { AuthProvider } from "../../../../enums/user.enum";
import { StatusCode } from "../../../../enums/statusCode.enum";

import type { IPasswordResetService } from "../../../interfaces/user/auth/IPasswordResetService";
import type { IUserRepository } from "../../../../repositories/interfaces/user/account/IUserRepository";
import type { IPasswordResetRepository } from "../../../../repositories/interfaces/common/IPasswordResetRepository";

import { CustomError } from "../../../../utils/customError";
import logger from "../../../../utils/logger";
import { validateDto } from "../../../../middlewares/validateDto.middleware";
import { sendResetPasswordEmail } from "../../../../utils/sendOtp";

import { MessageResponseDto } from "../../../../dtos/user/auth/message-response.dto";
import { ForgotPasswordDto } from "../../../../dtos/user/auth/forgot-password.dto";
import { ResetPasswordDto } from "../../../../dtos/user/auth/reset-password.dto";

@injectable()
export class PasswordResetService implements IPasswordResetService {
  constructor(
    @inject(TYPES.IUserRepository)
    private readonly userRepository: IUserRepository,

    @inject(TYPES.IPasswordResetRepository)
    private readonly passwordResetRepository: IPasswordResetRepository,
  ) {}

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

  async resetPassword(
    data: ResetPasswordDto,
  ): Promise<MessageResponseDto> {
    await validateDto(ResetPasswordDto, data);

    const { token, newPassword, confirmPassword } = data;

    if (newPassword !== confirmPassword) {
      throw new CustomError(
        "Passwords do not match.",
        StatusCode.BAD_REQUEST,
      );
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
}