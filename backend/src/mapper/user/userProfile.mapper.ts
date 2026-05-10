import { IUser } from "../../models/user.model";
import { UserProfile } from "../../dtos/user/userProfile.dto";
import { IClientProfile } from "../../models/clientProfile.model";

export const toUserProfileResponse = (
  user: IUser,
  clientProfile?: IClientProfile | null
): UserProfile => ({
  fullName: user.fullName ?? null,
  email: user.email ?? null,
  phone: user.phoneNumber ?? null,
  birthdate: clientProfile?.dateOfBirth
    ? clientProfile.dateOfBirth.toISOString()
    : null,
  gender: clientProfile?.gender ?? null,
});