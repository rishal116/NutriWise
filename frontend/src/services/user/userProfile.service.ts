import type { AxiosResponse } from "axios";
import { clientApi } from "@/lib/axios/clientApi";
import { PROFILE_ROUTES } from "@/routes/user/profile.routes";
import type { GetUserProfileDto } from "@/dtos/user/profile/get-user-profile.dto";
import type { UpdateUserProfileDto } from "@/dtos/user/profile/update-user-profile.dto";
import type { UserProfileImageDto } from "@/dtos/user/profile/user-profile-image.dto";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";

export const userProfileService = {
  async getProfile(): Promise<GetUserProfileDto> {
    const response: AxiosResponse<ApiResponseDTO<GetUserProfileDto>> =
      await clientApi.get(PROFILE_ROUTES.PROFILE);

    return response.data.data!;
  },

  async updateProfile(
    payload: UpdateUserProfileDto,
  ): Promise<GetUserProfileDto> {
    const response: AxiosResponse<ApiResponseDTO<GetUserProfileDto>> =
      await clientApi.put(PROFILE_ROUTES.PROFILE, payload);

    return response.data.data!;
  },

  async uploadProfileImage(file: File): Promise<UserProfileImageDto> {
    const formData = new FormData();
    formData.append("image", file);

    const response: AxiosResponse<ApiResponseDTO<UserProfileImageDto>> =
      await clientApi.patch(PROFILE_ROUTES.PROFILE_IMAGE, formData);

    return response.data.data!;
  },
};
