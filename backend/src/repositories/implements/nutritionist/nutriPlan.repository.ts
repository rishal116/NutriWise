import { Types } from "mongoose";
import type { FilterQuery } from "mongoose";
import { NutritionistPlanModel } from "../../../models/nutritionistPlan.model";
import type { INutritionistPlan } from "../../../models/nutritionistPlan.model";
import type { GetPlansDTO } from "../../../dtos/nutritionist/plan/get-plans.dto";
import { BaseRepository } from "../common/base.repository";
import type { INutritionistPlanRepository } from "../../interfaces/nutritionist/INutriPlanRepository";
import type { CursorData } from "../../../types/cursor.types";
import { encodeCursor, decodeCursor } from "../../../utils/cursor.util";
import {
  DEFAULT_NUTRITIONIST_PLAN_SORT,
  NUTRITIONIST_PLAN_SORT_CONFIG,
} from "../../../constants/nutritionist/plan/nutritionist-plan-sort.constants";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

export class NutritionistPlanRepository
  extends BaseRepository<INutritionistPlan>
  implements INutritionistPlanRepository
{
  constructor() {
    super(NutritionistPlanModel);
  }

  async findByNutritionistId(
    nutritionistId: string,
    query: GetPlansDTO,
  ): Promise<CursorPaginationResult<INutritionistPlan>> {
    const { cursor, limit, search, specialization, minPrice, maxPrice, sort } =
      query;

    const filter: FilterQuery<INutritionistPlan> = {
      nutritionistId: new Types.ObjectId(nutritionistId),
    };

    if (search?.trim()) {
      filter.title = {
        $regex: search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
      };
    }

    if (specialization) {
      filter.specialization = specialization;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {
        ...(minPrice !== undefined ? { $gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { $lte: maxPrice } : {}),
      };
    }

    const sortConfig =
      NUTRITIONIST_PLAN_SORT_CONFIG[sort] ?? DEFAULT_NUTRITIONIST_PLAN_SORT;

    const {
      field: cursorField,
      direction: sortDirection,
      sort: sortOption,
    } = sortConfig;

    if (cursor) {
      const decodedCursor = decodeCursor(cursor);

      if (
        !decodedCursor ||
        decodedCursor.sortKey !== cursorField ||
        !Types.ObjectId.isValid(decodedCursor.id)
      ) {
        throw new Error("Invalid pagination cursor.");
      }

      const cursorId = new Types.ObjectId(decodedCursor.id);

      if (cursorField === "_id") {
        filter._id = {
          $lt: cursorId,
        };
      } else {
        if (typeof decodedCursor.value !== "number") {
          throw new Error("Invalid pagination cursor.");
        }

        const operator = sortDirection === 1 ? "$gt" : "$lt";

        filter.$or = [
          {
            [cursorField]: {
              [operator]: decodedCursor.value,
            },
          },
          {
            [cursorField]: decodedCursor.value,
            _id: {
              [operator]: cursorId,
            },
          },
        ];
      }
    }

    const items = await this._model
      .find(filter)
      .select({
        _id: 1,
        nutritionistId: 1,
        slug: 1,
        title: 1,
        specialization: 1,
        description: 1,
        durationDays: 1,
        price: 1,
        currency: 1,
        features: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
      })
      .sort(sortOption)
      .limit(limit + 1)
      .lean<INutritionistPlan[]>()
      .exec();

    const hasMore = items.length > limit;

    if (hasMore) {
      items.pop();
    }

    const lastItem = items.at(-1);

    let nextCursor: string | null = null;

    if (hasMore && lastItem) {
      const cursorData: CursorData = {
        id: lastItem._id.toString(),
        value:
          cursorField === "_id"
            ? lastItem._id.toString()
            : lastItem[cursorField],
        sortKey: cursorField,
      };

      nextCursor = encodeCursor(cursorData);
    }

    return {
      items,
      nextCursor,
      hasMore,
    };
  }

  async findDetailsById(
    planId: string,
    nutritionistId: string,
  ): Promise<INutritionistPlan | null> {
    return this._model
      .findOne({
        _id: new Types.ObjectId(planId),
        nutritionistId: new Types.ObjectId(nutritionistId),
      })
      .lean<INutritionistPlan | null>()
      .exec();
  }
}
