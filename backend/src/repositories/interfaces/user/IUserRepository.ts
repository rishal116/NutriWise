import { IUser } from "../../../models/user.model";
import { IBaseRepository } from "../common/IBaseRepository";

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  updatePasswordById(userId: string, hashedPassword: string): Promise<void>;
  updatePasswordByEmail(email: string, hashedPassword: string): Promise<void>;
  findByGoogleId(googleId: string): Promise<IUser | null>;
  setResetToken(email: string, token: string, expires: Date): Promise<void>;
  findByResetToken(token: string): Promise<IUser | null>;
}
