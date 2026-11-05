import type { IUser } from "../../../../models/user.model";
import type { IBaseRepository } from "../../common/IBaseRepository";

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;

  findByEmailWithPassword(email: string): Promise<IUser | null>;

  findByUsername(username: string): Promise<IUser | null>;

  findByGoogleId(googleId: string): Promise<IUser | null>;

  updatePasswordById(userId: string, hashedPassword: string): Promise<void>;

  getProfileImageById(
    userId: string,
  ): Promise<Pick<IUser, "profileImage"> | null>;
}
