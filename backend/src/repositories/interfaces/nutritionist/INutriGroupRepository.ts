import type { ClientSession, Types } from "mongoose";

import type { IConversation } from "../../../models/conversation.model";

import type { CreateNutritionistGroupData } from "../../../types/nutritionist/group/create-nutritionist-group.type";

import type { NutritionistGroupDetailsResult } from "../../../types/nutritionist/group/nutritionist-group-details-result.type";

import type { NutritionistGroupListItem } from "../../../types/nutritionist/group/nutritionist-group-list-item.type";

import type { NutritionistGroupListQuery } from "../../../types/nutritionist/group/nutritionist-group-list-query.type";

import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

import type { IBaseRepository } from "../common/IBaseRepository";

export interface INutriGroupRepository extends IBaseRepository<IConversation> {
  createGroup(
    nutritionistId: string | Types.ObjectId,
    data: CreateNutritionistGroupData,
    session: ClientSession,
  ): Promise<IConversation>;

  findGroups(
    nutritionistId: string | Types.ObjectId,
    query: NutritionistGroupListQuery,
  ): Promise<CursorPaginationResult<NutritionistGroupListItem>>;

  findGroupDetails(
    nutritionistId: string | Types.ObjectId,
    groupId: string | Types.ObjectId,
  ): Promise<NutritionistGroupDetailsResult | null>;
}
