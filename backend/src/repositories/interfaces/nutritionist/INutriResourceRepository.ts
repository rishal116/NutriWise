import { Types } from "mongoose";
import { IBaseRepository } from "../../interfaces/common/IBaseRepository";
import { IResource } from "../../../models/resource.model";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { GetNutriResourcesQueryDTO } from "../../../dtos/nutritionist/resource/resource-list-query.dto";
import { INutriResourceDetailsProjection } from "../../../types/nutritionist/resource/nutri-resource-details.projection";
import { INutriResourceListProjection } from "../../../types/nutritionist/resource/nutri-resource-list.projection";

export interface INutriResourceRepository extends IBaseRepository<IResource> {
  findResources(
    nutritionistId: string | Types.ObjectId,
    query: GetNutriResourcesQueryDTO,
  ): Promise<CursorPaginationResult<INutriResourceListProjection>>;

  findResourceDetails(
    resourceId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<INutriResourceDetailsProjection | null>;

  publishResource(
    resourceId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
    publishedAt: Date,
  ): Promise<INutriResourceDetailsProjection | null>;

  archiveResource(
    resourceId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<INutriResourceDetailsProjection | null>;
}
