import { BaseRepository } from "../common/base.repository";
import { IUserRepository } from "../../interfaces/user/IUserRepository";
import { UserModel, IUser } from "../../../models/user.model";
import { Types } from "mongoose";

export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this._model.findOne({ email });
  }

  async updatePasswordByEmail(
    email: string,
    hashedPassword: string,
  ): Promise<void> {
    await this._model.updateOne(
      { email },
      {
        $set: {
          password: hashedPassword,
        },
      },
    );
  }

  async updatePasswordById(
    userId: string,
    hashedPassword: string,
  ): Promise<void> {
    await this._model.updateOne(
      { _id: userId },
      {
        $set: {
          password: hashedPassword,
        },
      },
    );
  }

  async findByGoogleId(googleProviderId: string): Promise<IUser | null> {
    return this._model.findOne({ googleProviderId });
  }

  async updateGoogleProviderId(
    email: string,
    googleProviderId: string,
  ): Promise<void> {
    await this._model.updateOne(
      { email },
      {
        $set: {
          googleProviderId,
        },
      },
    );
  }

  async setResetToken(
    email: string,
    token: string,
    expires: Date,
  ): Promise<void> {
    await this._model.updateOne(
      { email },
      {
        $set: {
          resetPasswordToken: token,
          resetPasswordExpires: expires,
        },
      },
    );
  }

  async findByResetToken(token: string): Promise<IUser | null> {
    return this._model.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
  }

  async findByIds(ids: string[]): Promise<IUser[]> {
    if (!ids.length) return [];

    const objectIds = ids
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));

    if (!objectIds.length) return [];

    return this._model.find({ _id: { $in: objectIds } }).lean<IUser[]>();
  }

  async getProfileImageById(
    userId: string,
  ): Promise<{ profileImageUrl: string } | null> {
    return this._model
      .findById(userId)
      .select("profileImageUrl")
      .lean<{ profileImageUrl: string }>();
  }
}
