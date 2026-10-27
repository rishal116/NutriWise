import { Types } from "mongoose";

import { PublicResourceListQueryDTO } from "../../../dtos/public/resource/public-resource-list-query.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { PublicResourceDTO } from "../../../dtos/public/resource/public-resource.dto";

export interface IPublicResourceService {
  getPublicResources(
    query: PublicResourceListQueryDTO,
    userId?: string | Types.ObjectId,
  ): Promise<InfiniteScrollResponseDTO<PublicResourceDTO>>;

  getPublicResourceDetails(
    resourceId: string | Types.ObjectId,
    userId?: string | Types.ObjectId,
  ): Promise<PublicResourceDTO>;
}
