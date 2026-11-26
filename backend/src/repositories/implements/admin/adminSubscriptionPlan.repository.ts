
import { injectable } from "inversify";
import { Types } from "mongoose";
import type { PipelineStage } from "mongoose";

import {
  SubscriptionPlanModel,
  type ISubscriptionPlan,
} from "../../../models/subscriptionPlan.model";
import type { AdminSubscriptionPlanListQueryDTO } from "../../../dtos/admin/subscription-plan/admin-subscription-plan-list-query.dto";
import type { AdminSubscriptionPlanListItem } from "../../../types/admin/subscription-plan/admin-subscription-plan-list-item.type";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { decodeCursor, encodeCursor } from "../../../utils/cursor.util";
import type { IAdminSubscriptionPlanRepository } from "../../interfaces/admin/IAdminSubscriptionPlanRepository";
import { BaseRepository } from "../common/base.repository";

const ADMIN_SUBSCRIPTION_PLAN_SORT_FIELD_MAP = {
  newest: "createdAt",
  oldest: "createdAt",
} as const;

type SubscriptionPlanCardWithCursor = AdminSubscriptionPlanListItem & {
  cursorId: Types.ObjectId;
  cursorValue: Date;
};

@injectable()
export class AdminSubscriptionPlanRepository
  extends BaseRepository<ISubscriptionPlan>
  implements IAdminSubscriptionPlanRepository
{
  constructor() {
    super(SubscriptionPlanModel);
  }

  async findPlans(
    query: AdminSubscriptionPlanListQueryDTO,
  ): Promise<CursorPaginationResult<AdminSubscriptionPlanListItem>> {
    const {
      search,
      audience,
      status,
      interval,
      sortBy = "newest",
      cursor,
      limit = 12,
    } = query;

    const sortField = ADMIN_SUBSCRIPTION_PLAN_SORT_FIELD_MAP[sortBy];
    const isAscending = sortBy === "oldest";
    const sortDirection = isAscending ? 1 : -1;

    const pipeline: PipelineStage[] = [];

    const matchStage = this.buildMatchStage({
      search,
      audience,
      status,
      interval,
    });

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    const cursorData = decodeCursor(cursor);

    if (cursorData) {
      if (cursorData.sortKey !== sortBy) {
        throw new Error("Invalid cursor");
      }

      pipeline.push(
        this.buildCursorMatchStage(
          cursorData,
          sortField,
          isAscending,
        ),
      );
    }

    pipeline.push(
      {
        $sort: {
          [sortField]: sortDirection,
          _id: sortDirection,
        },
      },
      {
        $limit: limit + 1,
      },
      {
        $project: {
          _id: 0,
          id: { $toString: "$_id" },
          name: 1,
          slug: 1,
          description: 1,
          audience: 1,
          billing: 1,
          featureCount: {
            $size: {
              $ifNull: ["$features", []],
            },
          },
          status: 1,
          cursorId: "$_id",
          cursorValue: `$${sortField}`,
        },
      },
    );

    const result =
      await this._model
        .aggregate<SubscriptionPlanCardWithCursor>(pipeline)
        .exec();

    const hasMore = result.length > limit;
    const items = hasMore ? result.slice(0, limit) : result;
    const lastItem = items[items.length - 1];

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            id: lastItem.cursorId.toString(),
            value: lastItem.cursorValue.toISOString(),
            sortKey: sortBy,
          })
        : null;

    const cleanItems: AdminSubscriptionPlanListItem[] = items.map(
      ({ cursorId: _cursorId, cursorValue: _cursorValue, ...item }) =>
        item,
    );

    return {
      items: cleanItems,
      nextCursor,
      hasMore,
    };
  }

  private buildMatchStage(
    filters: Pick<
      AdminSubscriptionPlanListQueryDTO,
      "search" | "audience" | "status" | "interval"
    >,
  ): PipelineStage.Match["$match"] {
    const { search, audience, status, interval } = filters;

    const matchStage: PipelineStage.Match["$match"] = {};

    if (audience) {
      matchStage.audience = audience;
    }

    if (status) {
      matchStage.status = status;
    }

    if (interval) {
      matchStage["billing.interval"] = interval;
    }

    if (search?.trim()) {
      const escapedSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      matchStage.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        { slug: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    return matchStage;
  }

  private buildCursorMatchStage(
    cursorData: NonNullable<ReturnType<typeof decodeCursor>>,
    sortField: string,
    isAscending: boolean,
  ): PipelineStage.Match {
    if (typeof cursorData.value !== "string") {
      throw new Error("Invalid cursor");
    }

    const cursorValue = new Date(cursorData.value);

    if (Number.isNaN(cursorValue.getTime())) {
      throw new Error("Invalid cursor");
    }

    const cursorId = new Types.ObjectId(cursorData.id);
    const comparisonOperator = isAscending ? "$gt" : "$lt";

    return {
      $match: {
        $or: [
          {
            [sortField]: {
              [comparisonOperator]: cursorValue,
            },
          },
          {
            [sortField]: cursorValue,
            _id: {
              [comparisonOperator]: cursorId,
            },
          },
        ],
      },
    };
  }
}
