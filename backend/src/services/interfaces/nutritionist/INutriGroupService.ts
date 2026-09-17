import type { CreateGroupDTO } from "../../../dtos/nutritionist/group/create-group.dto";
import type { GroupCardDTO } from "../../../dtos/nutritionist/group/group-card.dto";
import type { GroupDetailsDTO } from "../../../dtos/nutritionist/group/group-details.dto";
import type { NutritionistGroupListQueryDTO } from "../../../dtos/nutritionist/group/group-list-query.dto";
import type { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

export interface INutriGroupService {
  createGroup(
    nutritionistId: string,
    data: CreateGroupDTO,
  ): Promise<GroupDetailsDTO>;

  browseGroups(
    nutritionistId: string,
    query: NutritionistGroupListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<GroupCardDTO>>;

  getGroup(nutritionistId: string, groupId: string): Promise<GroupDetailsDTO>;
}
