import type { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

import type { PublicGroupListItemDTO } from "../../../dtos/public/group/public-group-list-item.dto";

import type { PublicGroupListQueryDTO } from "../../../dtos/public/group/public-group-list-query.dto";

import type { PublicGroupDetailsDTO } from "../../../dtos/public/group/public-group-details.dto";

export interface IPublicGroupService {
  browseGroups(
    query: PublicGroupListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<PublicGroupListItemDTO>>;

  getGroup(groupId: string): Promise<PublicGroupDetailsDTO>;

  joinGroup(userId: string, groupId: string): Promise<PublicGroupDetailsDTO>;
}
