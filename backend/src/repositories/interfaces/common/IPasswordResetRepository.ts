import { IPasswordResetToken } from "../../../models/passwordResetToken.model";
export interface IPasswordResetRepository {
  createResetToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<void>;

  findResetToken(token: string): Promise<IPasswordResetToken | null>;

  deleteResetToken(token: string): Promise<void>;

  deleteUserResetTokens(userId: string): Promise<void>;
}
