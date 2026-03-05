import { IUser } from "../../models/user.model";
import { UserProfile} from "../../dtos/user/userProfile.dto";

export const toUserProfileResponse = (
  user: IUser
): UserProfile => ({
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  birthdate: user.birthdate,
  gender: user.gender,
});