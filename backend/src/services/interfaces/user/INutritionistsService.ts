import { NutritionistListFilter, NutritionistUserSideDTO, NutritionistUserDTO, NutritionistPlanDTO } from "../../../dtos/user/nutritionistUser.dto";
import { ReviewResponseDTO } from "../../../dtos/user/review.dto";

export interface INutritionistService {
  getAll(filters: NutritionistListFilter): Promise<{
    data: NutritionistUserSideDTO[];
    total: number;
    page: number;
    totalPages: number;
  }>;

  getById(id: string): Promise<NutritionistUserDTO>;

  getPlansByNutritionist(id: string): Promise<NutritionistPlanDTO[]>;

  getReviewsByNutritionist(
    nutritionistId: string
  ): Promise<{ reviews: ReviewResponseDTO[]; averageRating: number }>;
}