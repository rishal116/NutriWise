import { IUser } from "../../../models/user.model";
import { IBaseRepository } from "../IBaseRepository";
import { UpdateQuery } from "mongoose";

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  updatePassword(email: string, hashedPassword: string): Promise<void>;
  findByGoogleId(googleId: string): Promise<IUser | null>;
  setResetToken(email: string, token: string, expires: Date): Promise<void>;
  findByResetToken(token: string): Promise<IUser | null>;
  
}
