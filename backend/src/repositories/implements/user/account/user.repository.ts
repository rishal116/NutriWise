import { BaseRepository } from "../../common/base.repository";

import type { IUserRepository } from "../../../interfaces/user/account/IUserRepository";
import { UserModel } from "../../../../models/user.model";
import type { IUser } from "../../../../models/user.model";

export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this._model.findOne({ email }).lean<IUser | null>().exec();
  }

  async findByEmailWithPassword(email: string): Promise<IUser | null> {
    return this._model
      .findOne({ email })
      .select("+password")
      .lean<IUser | null>()
      .exec();
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return this._model.findOne({ username }).lean<IUser | null>().exec();
  }

  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return this._model.findOne({ googleId }).lean<IUser | null>().exec();
  }

  async updatePasswordById(
    userId: string,
    hashedPassword: string,
  ): Promise<void> {
    await this._model
      .updateOne(
        { _id: userId },
        {
          $set: {
            password: hashedPassword,
          },
        },
      )
      .exec();
  }

  async getProfileImageById(
    userId: string,
  ): Promise<Pick<IUser, "profileImage"> | null> {
    return this._model
      .findById(userId)
      .select("profileImage -_id")
      .lean<Pick<IUser, "profileImage"> | null>()
      .exec();
  }
}
