import { ApiResponseDTO } from "../../common/api-response.dto";
import { InfiniteScrollResponseDTO } from "../../common/infinite-scroll-response.dto";
import { NutritionistCardDTO } from "./nutri-card.dto";

export type NutritionistBrowseResponseDTO = ApiResponseDTO<
  InfiniteScrollResponseDTO<NutritionistCardDTO>
>;
