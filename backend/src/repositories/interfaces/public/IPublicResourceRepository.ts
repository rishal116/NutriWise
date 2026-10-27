import { Types } from "mongoose";
import { IBaseRepository } from "../common/IBaseRepository";
import { IResource } from "../../../models/resource.model";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { PublicResourceListQueryDTO } from "../../../dtos/public/resource/public-resource-list-query.dto";
import { IResourceProjection } from "../../../types/public/resource/public-resource.projection";

export interface IPublicResourceRepository extends IBaseRepository<IResource> {
  findPublicResources(
    query: PublicResourceListQueryDTO,
    userId?: string | Types.ObjectId,
  ): Promise<CursorPaginationResult<IResourceProjection>>;

  findPublicResourceDetails(
    resourceId: string | Types.ObjectId,
    userId?: string | Types.ObjectId,
  ): Promise<IResourceProjection | null>;
}
