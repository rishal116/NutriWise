import { injectable } from "inversify";
import { Types } from "mongoose";
import type { PipelineStage } from "mongoose";
import { NutritionistPlanDayModel } from "../../../models/nutritionistPlanDay.model";
import type { INutritionistPlanDay } from "../../../models/nutritionistPlanDay.model";
import { BaseRepository } from "../common/base.repository";
import type { INutritionistPlanDayRepository } from "../../interfaces/nutritionist/INutritionistPlanDayRepository";
import type {
  NutritionistPlanDayDetailsProjection,
  NutritionistPlanDayListProjection,
} from "../../../types/nutritionist/plan-day/nutritionist-plan-day.projection";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { decodeCursor, encodeCursor } from "../../../utils/cursor.util";
import { NutritionistPlanDaySort } from "../../../dtos/nutritionist/plan-day/nutritionist-plan-day-list-query.dto";
import type { NutritionistPlanDayListQueryDTO } from "../../../dtos/nutritionist/plan-day/nutritionist-plan-day-list-query.dto";
import { NUTRITIONIST_PLAN_DAY_SORT_FIELD_MAP } from "../../../constants/nutritionist/plan-day/nutritionist-plan-day-sort.constants";

type PlanDayCursor = NonNullable<ReturnType<typeof decodeCursor>>;

interface PlanDayCardWithCursor extends NutritionistPlanDayListProjection {
  cursorId: Types.ObjectId;
  cursorValue: number | Date;
}

@injectable()
export class NutritionistPlanDayRepository
  extends BaseRepository<INutritionistPlanDay>
  implements INutritionistPlanDayRepository
{
  constructor() {
    super(NutritionistPlanDayModel);
  }

  async countDaysByPlanIds(
    planIds: Types.ObjectId[],
  ): Promise<Map<string, number>> {
    if (planIds.length === 0) {
      return new Map<string, number>();
    }

    const results = await this._model.aggregate<{
      _id: Types.ObjectId;
      count: number;
    }>([
      {
        $match: {
          planId: { $in: planIds },
        },
      },
      {
        $group: {
          _id: "$planId",
          count: { $sum: 1 },
        },
      },
    ]);

    return new Map(results.map(({ _id, count }) => [_id.toString(), count]));
  }

  async browsePlanDays(
    nutritionistId: string | Types.ObjectId,
    planId: string | Types.ObjectId,
    query: NutritionistPlanDayListQueryDTO,
  ): Promise<CursorPaginationResult<NutritionistPlanDayListProjection>> {
    const {
      limit = 12,
      search,
      dayNumber,
      sort = NutritionistPlanDaySort.DAY_ASC,
      cursor,
    } = query;

    const nutritionistObjectId = this.toObjectId(nutritionistId);
    const planObjectId = this.toObjectId(planId);

    const pageLimit = Math.min(Math.max(Math.trunc(limit), 1), 50);

    const { field, order } = NUTRITIONIST_PLAN_DAY_SORT_FIELD_MAP[sort];

    const cursorData = this.validateCursor(cursor, sort);

    const pipeline = this.buildBrowsePipeline({
      planId: planObjectId,
      nutritionistId: nutritionistObjectId,
      search,
      dayNumber,
      cursorData,
      field,
      order,
      pageLimit,
    });

    const result = await this._model.aggregate<PlanDayCardWithCursor>(pipeline);

    const hasMore = result.length > pageLimit;
    const items = hasMore ? result.slice(0, pageLimit) : result;

    const lastItem = items.at(-1);

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            id: lastItem.cursorId.toString(),
            value:
              lastItem.cursorValue instanceof Date
                ? lastItem.cursorValue.toISOString()
                : lastItem.cursorValue,
            sortKey: sort,
          })
        : null;

    const cleanItems = items.map(
      ({ cursorId: _cursorId, cursorValue: _cursorValue, ...item }) => item,
    );

    return {
      items: cleanItems,
      nextCursor,
      hasMore,
    };
  }

  async findPlanDayDetails(
    nutritionistId: string | Types.ObjectId,
    planId: string | Types.ObjectId,
    dayNumber: number,
  ): Promise<NutritionistPlanDayDetailsProjection | null> {
    const nutritionistObjectId = this.toObjectId(nutritionistId);
    const planObjectId = this.toObjectId(planId);

    const pipeline: PipelineStage[] = [
      {
        $match: {
          planId: planObjectId,
          dayNumber,
        },
      },
      {
        $lookup: {
          from: "nutritionistplans",
          localField: "planId",
          foreignField: "_id",
          as: "plan",
        },
      },
      {
        $unwind: "$plan",
      },
      {
        $match: {
          "plan.nutritionistId": nutritionistObjectId,
        },
      },
      {
        $project: {
          _id: 1,
          planId: 1,
          dayNumber: 1,
          title: 1,
          description: 1,
          activities: {
            $map: {
              input: "$activities",
              as: "activity",
              in: {
                _id: "$$activity._id",
                category: "$$activity.category",
                title: "$$activity.title",
                description: "$$activity.description",
                instructions: "$$activity.instructions",
                valueType: "$$activity.valueType",
                targetValue: "$$activity.targetValue",
                unit: "$$activity.unit",
                estimatedDurationMinutes: "$$activity.estimatedDurationMinutes",
                scheduledTime: "$$activity.scheduledTime",
                isRequired: "$$activity.isRequired",
                order: "$$activity.order",
              },
            },
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];

    const [day] =
      await this._model.aggregate<NutritionistPlanDayDetailsProjection>(
        pipeline,
      );

    return day ?? null;
  }

  private buildBrowsePipeline(params: {
    planId: Types.ObjectId;
    nutritionistId: Types.ObjectId;
    search?: string;
    dayNumber?: number;
    cursorData: PlanDayCursor | null;
    field: "dayNumber" | "createdAt";
    order: 1 | -1;
    pageLimit: number;
  }): PipelineStage[] {
    const {
      planId,
      nutritionistId,
      search,
      dayNumber,
      cursorData,
      field,
      order,
      pageLimit,
    } = params;

    const pipeline: PipelineStage[] = [
      {
        $match: {
          planId,
        },
      },
      {
        $lookup: {
          from: "nutritionistplans",
          localField: "planId",
          foreignField: "_id",
          as: "plan",
        },
      },
      {
        $unwind: "$plan",
      },
      {
        $match: {
          "plan.nutritionistId": nutritionistId,
        },
      },
    ];

    const searchText = search?.trim();

    if (searchText) {
      pipeline.push(this.buildSearchMatch(searchText));
    }

    if (dayNumber !== undefined) {
      pipeline.push({
        $match: {
          dayNumber,
        },
      });
    }

    if (cursorData) {
      pipeline.push(this.buildCursorMatch(cursorData, field, order));
    }

    pipeline.push(
      {
        $sort: {
          [field]: order,
          _id: order,
        },
      },
      {
        $limit: pageLimit + 1,
      },
      {
        $project: {
          _id: 1,
          planId: 1,
          dayNumber: 1,
          title: 1,
          description: 1,
          totalActivities: {
            $size: "$activities",
          },
          requiredActivities: {
            $size: {
              $filter: {
                input: "$activities",
                as: "activity",
                cond: {
                  $eq: ["$$activity.isRequired", true],
                },
              },
            },
          },
          createdAt: 1,
          updatedAt: 1,
          cursorId: "$_id",
          cursorValue: `$${field}`,
        },
      },
    );

    return pipeline;
  }

  private buildSearchMatch(searchText: string): PipelineStage.Match {
    const escapedSearch = searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const searchConditions: Record<string, unknown>[] = [
      {
        title: {
          $regex: escapedSearch,
          $options: "i",
        },
      },
      {
        description: {
          $regex: escapedSearch,
          $options: "i",
        },
      },
      {
        "activities.title": {
          $regex: escapedSearch,
          $options: "i",
        },
      },
    ];

    const searchNumber = Number(searchText);

    if (Number.isSafeInteger(searchNumber) && searchNumber > 0) {
      searchConditions.push({
        dayNumber: searchNumber,
      });
    }

    return {
      $match: {
        $or: searchConditions,
      },
    };
  }

  private buildCursorMatch(
    cursorData: PlanDayCursor,
    field: "dayNumber" | "createdAt",
    order: 1 | -1,
  ): PipelineStage.Match {
    const cursorValue =
      field === "createdAt"
        ? new Date(String(cursorData.value))
        : Number(cursorData.value);

    if (
      (field === "createdAt" &&
        (!(cursorValue instanceof Date) ||
          Number.isNaN(cursorValue.getTime()))) ||
      (field === "dayNumber" &&
        (typeof cursorValue !== "number" || !Number.isFinite(cursorValue)))
    ) {
      throw new Error("Invalid cursor.");
    }

    const cursorId = new Types.ObjectId(cursorData.id);
    const operator = order === -1 ? "$lt" : "$gt";

    return {
      $match: {
        $or: [
          {
            [field]: {
              [operator]: cursorValue,
            },
          },
          {
            [field]: cursorValue,
            _id: {
              [operator]: cursorId,
            },
          },
        ],
      },
    };
  }

  private validateCursor(
    cursor: string | undefined,
    sort: NutritionistPlanDaySort,
  ): PlanDayCursor | null {
    if (!cursor) {
      return null;
    }

    const cursorData = decodeCursor(cursor);

    if (
      !cursorData ||
      cursorData.sortKey !== sort ||
      !Types.ObjectId.isValid(cursorData.id)
    ) {
      throw new Error("Invalid cursor.");
    }

    return cursorData;
  }

  private toObjectId(value: string | Types.ObjectId): Types.ObjectId {
    if (value instanceof Types.ObjectId) {
      return value;
    }

    if (!Types.ObjectId.isValid(value)) {
      throw new Error("Invalid identifier.");
    }

    return new Types.ObjectId(value);
  }
}
