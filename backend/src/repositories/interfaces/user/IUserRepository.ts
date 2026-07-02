import { IUser } from "../../../models/user.model";
import { IBaseRepository } from "../common/IBaseRepository";

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;

  findByIds(ids: string[]): Promise<IUser[]>;

  findByGoogleId(googleId: string): Promise<IUser | null>;

  updatePasswordById(userId: string, hashedPassword: string): Promise<void>;

  getProfileImageById(
    userId: string,
  ): Promise<Pick<IUser, "profileImage"> | null>;
}
