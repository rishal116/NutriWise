import { Types } from "mongoose";
import { IBaseRepository } from "../common/IBaseRepository";
import { IResource } from "../../../models/resource.model";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { PublicResourceListQueryDTO } from "../../../dtos/public/resource/public-resource-list-query.dto";
import { IResourceListItemProjection } from "../../../types/public/resource/resource-list-item-projection";
import { IResourceDetailsProjection } from "../../../types/public/resource/resource-details-projection";

export interface IResourceRepository extends IBaseRepository<IResource> {
  findPublicResources(
    query: PublicResourceListQueryDTO,
  ): Promise<CursorPaginationResult<IResourceListItemProjection>>;
  findPublicResourceDetails(
    resourceId: string | Types.ObjectId,
  ): Promise<IResourceDetailsProjection | null>;
  incrementViewCount(resourceId: string | Types.ObjectId): Promise<void>;
  incrementDownloadCount(resourceId: string | Types.ObjectId): Promise<void>;
  incrementShareCount(resourceId: string | Types.ObjectId): Promise<void>;
}
