import { injectable } from "inversify";
import {
  IPasswordResetToken,
  PasswordResetTokenModel,
} from "../../../models/passwordResetToken.model";
import { IPasswordResetRepository } from "../../interfaces/common/IPasswordResetRepository";

@injectable()
export class PasswordResetRepository
  implements IPasswordResetRepository
{
  async createResetToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    await PasswordResetTokenModel.create({
      userId,
      token,
      expiresAt,
    });
  }

  async findResetToken(
    token: string,
  ): Promise<IPasswordResetToken | null> {
    return PasswordResetTokenModel.findOne({ token });
  }

  async deleteResetToken(token: string): Promise<void> {
    await PasswordResetTokenModel.deleteOne({ token });
  }

  async deleteUserResetTokens(userId: string): Promise<void> {
    await PasswordResetTokenModel.deleteMany({ userId });
  }
}