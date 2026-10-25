import { Types } from "mongoose";
import { UserRole } from "../../../enums/user.enum";

export interface IAdminUserListProjection {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  username: string;
  profileImage?: string;
  activeRole: UserRole;
  isBlocked: boolean;
  createdAt: Date;
}
