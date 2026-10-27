import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

import { CreateNutriResourceDTO } from "../../../dtos/nutritionist/resource/create-resource.dto";
import { UpdateNutriResourceDTO } from "../../../dtos/nutritionist/resource/update-resource.dto";

import { GetNutriResourceParamsDTO } from "../../../dtos/nutritionist/resource/resource-params.dto";
import { GetNutriResourcesQueryDTO } from "../../../dtos/nutritionist/resource/resource-list-query.dto";

import { NutriResourceListItemDTO } from "../../../dtos/nutritionist/resource/resource-list-response.dto";
import { NutriResourceDetailsResponseDTO } from "../../../dtos/nutritionist/resource/resource-details-response.dto";

export interface INutriResourceService {
  createResource(
    nutritionistId: string,
    dto: CreateNutriResourceDTO,
    file?: Express.Multer.File,
  ): Promise<void>;

  getResources(
    nutritionistId: string,
    query: GetNutriResourcesQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NutriResourceListItemDTO>>;

  getResourceDetails(
    nutritionistId: string,
    params: GetNutriResourceParamsDTO,
  ): Promise<NutriResourceDetailsResponseDTO>;

  updateResource(
    nutritionistId: string,
    params: GetNutriResourceParamsDTO,
    dto: UpdateNutriResourceDTO,
  ): Promise<void>;

  publishResource(
    nutritionistId: string,
    params: GetNutriResourceParamsDTO,
  ): Promise<void>;

  archiveResource(
    nutritionistId: string,
    params: GetNutriResourceParamsDTO,
  ): Promise<void>;
}
