import { Types } from "mongoose";

import { IBaseRepository } from "../../interfaces/common/IBaseRepository";
import { IResource } from "../../../models/resource.model";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { GetNutriResourcesQueryDTO } from "../../../dtos/nutritionist/resource/resource-list-query.dto";
import { INutriResourceProjection } from "../../../types/nutritionist/resource/nutri-resource.projection";

export interface INutriResourceRepository extends IBaseRepository<IResource> {
  findResources(
    nutritionistId: string | Types.ObjectId,
    query: GetNutriResourcesQueryDTO,
  ): Promise<CursorPaginationResult<INutriResourceProjection>>;

  findResourceDetails(
    resourceId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<INutriResourceProjection | null>;
}
