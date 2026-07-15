import { clientApi } from "@/lib/axios/clientApi";
import { PROFILE_ROUTES } from "@/routes/user/profile.routes";

import { GetUserProfileDto } from "@/dtos/user/profile/get-user-profile.dto";
import { UpdateUserProfileDto } from "@/dtos/user/profile/update-user-profile.dto";
import { UserProfileImageDto } from "@/dtos/user/profile/user-profile-image.dto";

export const userProfileService = {
  async getProfile(): Promise<GetUserProfileDto> {
    const response = await clientApi.get(PROFILE_ROUTES.PROFILE);
    return response.data.data;
  },

  async updateProfile(
    payload: UpdateUserProfileDto,
  ): Promise<GetUserProfileDto> {
    const response = await clientApi.put(PROFILE_ROUTES.PROFILE, payload);

    return response.data.data;
  },

  async uploadProfileImage(file: File): Promise<UserProfileImageDto> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await clientApi.patch(
      PROFILE_ROUTES.PROFILE_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data.data;
  },
};
