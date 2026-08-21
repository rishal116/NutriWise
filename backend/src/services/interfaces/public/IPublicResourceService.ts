import { Types } from "mongoose";

import { PublicResourceListQueryDTO } from "../../../dtos/public/resource/public-resource-list-query.dto";

import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

import { PublicResourceListItemDTO } from "../../../dtos/public/resource/public-resource-list-item.dto";

import { PublicResourceDetailsDTO } from "../../../dtos/public/resource/public-resource-details.dto";

export interface IPublicResourceService {
  getPublicResources(
    query: PublicResourceListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<PublicResourceListItemDTO>>;

  getPublicResourceDetails(
    resourceId: string | Types.ObjectId,
  ): Promise<PublicResourceDetailsDTO>;

  recordResourceView(resourceId: string | Types.ObjectId): Promise<void>;

  recordResourceDownload(resourceId: string | Types.ObjectId): Promise<void>;

  recordResourceShare(resourceId: string | Types.ObjectId): Promise<void>;
}
