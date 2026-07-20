import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { INutritionistBrowsingService } from "../../interfaces/user/INutriBrowsingService";
import { INutritionistBrowsingRepository } from "../../../repositories/interfaces/user/INutriBrowsingRepository";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { NutritionistListQueryDTO } from "../../../dtos/user/nutri-browsing/nutri-list-query.dto";
import { NutritionistCardDTO } from "../../../dtos/user/nutri-browsing/nutri-card.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import {
  toNutritionistBrowseStatsDTO,
  toNutritionistCardListDTO,
  toNutritionistDetailDTO,
} from "../../../mapper/user/nutri-browsing/nutri-browsing.mapper";
import { NutritionistDetailDTO } from "../../../dtos/user/nutri-browsing/nutri-profile.dto";
import { NutritionistBrowseStatsDTO } from "../../../dtos/user/nutri-browsing/nutri-browse-stats.dto";

@injectable()
export class NutritionistBrowsingService implements INutritionistBrowsingService {
  constructor(
    @inject(TYPES.INutritionistBrowsingRepository)
    private readonly _nutritionistBrowsingRepository: INutritionistBrowsingRepository,
  ) {}

  async browseNutritionists(
    query: NutritionistListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutritionistCardDTO>> {
    logger.info("Browsing nutritionists");
    if (query.limit && (query.limit < 1 || query.limit > 30)) {
      throw new CustomError("Invalid limit", StatusCode.BAD_REQUEST);
    }
    if (
      query.minRating !== undefined &&
      (query.minRating < 0 || query.minRating > 5)
    ) {
      throw new CustomError(
        "Rating must be between 0 and 5",
        StatusCode.BAD_REQUEST,
      );
    }
    const result =
      await this._nutritionistBrowsingRepository.findNutritionists(query);
    return toNutritionistCardListDTO(result);
  }

  async getNutritionistProfile(
    username: string,
  ): Promise<NutritionistDetailDTO> {
    logger.info(`Fetching nutritionist profile. Username: ${username}`);
    if (!username.trim()) {
      throw new CustomError("Username is required", StatusCode.BAD_REQUEST);
    }
    const nutritionist =
      await this._nutritionistBrowsingRepository.findNutritionistByUsername(
        username,
      );
    if (!nutritionist) {
      throw new CustomError("Nutritionist not found", StatusCode.NOT_FOUND);
    }

    return toNutritionistDetailDTO(nutritionist);
  }

  async getBrowseStatistics(): Promise<NutritionistBrowseStatsDTO> {
    logger.info("Fetching nutritionist browsing statistics");

    const result =
      await this._nutritionistBrowsingRepository.getBrowseStatistics();

    return toNutritionistBrowseStatsDTO(result);
  }
}
