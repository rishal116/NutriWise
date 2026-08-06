import { BaseRepository } from "../../common/base.repository";
import { IUserRepository } from "../../../interfaces/user/account/IUserRepository";
import { IUser, UserModel } from "../../../../models/user.model";

export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this._model.findOne({ email }).lean<IUser | null>();
  }

  async findByEmailWithPassword(email: string): Promise<IUser | null> {
    return this._model.findOne({ email }).select("+password");
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return this._model.findOne({ username }).lean<IUser | null>();
  }

  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return this._model.findOne({ googleId }).lean<IUser | null>();
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

  async getProfileImageById(
    userId: string,
  ): Promise<Pick<IUser, "profileImage"> | null> {
    return this._model.findById(userId).select("profileImage").lean();
  }
}
