import {
  INutritionistProfileDTOInput,
  NutritionistProfileDTO,
  AdminNutritionistProfileDTO,
  IUserDTOInput,
} from "../../dtos/admin/user.dto";

export class NutritionistProfileMapper {

  static toProfileDTO(profile: INutritionistProfileDTOInput): NutritionistProfileDTO {
    return new NutritionistProfileDTO(profile);
  }

  static toAdminDTO(
    user: IUserDTOInput,
    profile: INutritionistProfileDTOInput
  ): AdminNutritionistProfileDTO {
    return new AdminNutritionistProfileDTO(user, profile);
  }

  static toAdminDTOList(
    data: { user: IUserDTOInput; profile: INutritionistProfileDTOInput }[]
  ): AdminNutritionistProfileDTO[] {
    return data.map((item) =>
      this.toAdminDTO(item.user, item.profile)
    );
  }
}