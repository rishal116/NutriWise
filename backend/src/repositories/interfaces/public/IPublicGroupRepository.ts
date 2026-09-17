import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import type { PublicGroupListItem } from "../../../types/public/group/public-group-list-item.type";
import type { PublicGroupListQuery } from "../../../types/public/group/public-group-list-query.type";
import type { IConversation } from "../../../models/conversation.model";

export interface IPublicGroupRepository {
  findGroups(
    query: PublicGroupListQuery,
  ): Promise<CursorPaginationResult<PublicGroupListItem>>;

  findGroupById(
    groupId: string,
  ): Promise<IConversation | null>;
}