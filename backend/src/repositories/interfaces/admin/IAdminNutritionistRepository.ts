import { INutritionistProfile } from "../../../models/nutritionistProfile.model";
import { NutritionistLevel } from "../../../enums/nutritionist.enum";
import { VerificationStatus } from "../../../models/nutritionistProfile.model";
import { IUserDTOInput } from "../../../dtos/admin/user.dto";

export interface IAdminNutritionistRepository {
  findByUserId(userId: string): Promise<INutritionistProfile | null>;

  getNutritionistApplications(
    skip: number,
    limit: number,
    search?: string,
  ): Promise<{
    nutritionists: IUserDTOInput[];
    total: number;
  }>;

  updateNutritionistLevel(
    userId: string,
    level: NutritionistLevel,
  ): Promise<INutritionistProfile | null>;

    updateVerificationStatus(
    userId: string,
    status: VerificationStatus,
    rejectionReason?: string
  ): Promise<INutritionistProfile | null>;
}
