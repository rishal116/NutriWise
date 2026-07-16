import { FilterQuery, SortOrder, Types } from "mongoose";

import {
  INutritionistPlan,
  NutritionistPlanModel,
} from "../../../models/nutritionistPlan.model";

import { GetPlansDTO } from "../../../dtos/nutritionist/plan/get-plans.dto";

import { BaseRepository } from "../common/base.repository";
import { INutritionistPlanRepository } from "../../interfaces/nutritionist/INutriPlanRepository";

export class NutritionistPlanRepository
  extends BaseRepository<INutritionistPlan>
  implements INutritionistPlanRepository
{
  constructor() {
    super(NutritionistPlanModel);
  }

  async findMany(
    filter: FilterQuery<INutritionistPlan>,
  ): Promise<INutritionistPlan[]> {
    return this._model
      .find(filter)
      .sort({ createdAt: -1 })
      .lean<INutritionistPlan[]>();
  }

  async findByNutritionistId(
    nutritionistId: string,
    query: GetPlansDTO,
  ): Promise<{
    items: INutritionistPlan[];
    nextCursor: string | null;
    hasMore: boolean;
  }> {
    const { cursor, limit, search, specialization, minPrice, maxPrice, sort } =
      query;

    const filter: FilterQuery<INutritionistPlan> = {
      nutritionistId: new Types.ObjectId(nutritionistId),
      isDeleted: false,
    };

    if (search) {
      filter.title = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    if (specialization) {
      filter.specialization = specialization;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};

      if (minPrice !== undefined) {
        filter.price.$gte = minPrice;
      }

      if (maxPrice !== undefined) {
        filter.price.$lte = maxPrice;
      }
    }

    let sortOption: Record<string, SortOrder>;
    let cursorField = "_id";

    switch (sort) {
      case "price_low_to_high":
        sortOption = {
          price: 1,
          _id: 1,
        };
        cursorField = "price";
        break;

      case "price_high_to_low":
        sortOption = {
          price: -1,
          _id: -1,
        };
        cursorField = "price";
        break;

      case "duration_shortest":
        sortOption = {
          durationDays: 1,
          _id: 1,
        };
        cursorField = "durationDays";
        break;

      case "duration_longest":
        sortOption = {
          durationDays: -1,
          _id: -1,
        };
        cursorField = "durationDays";
        break;

      default:
        sortOption = {
          _id: -1,
        };
    }

    if (cursor && cursorField === "_id") {
      filter._id = {
        $lt: new Types.ObjectId(cursor),
      };
    }

    const items = await this._model
      .find(filter)
      .sort(sortOption)
      .limit(limit + 1)
      .lean<INutritionistPlan[]>();

    const hasMore = items.length > limit;

    if (hasMore) {
      items.pop();
    }

    return {
      items,
      nextCursor:
        hasMore && items.length ? items[items.length - 1]._id.toString() : null,
      hasMore,
    };
  }
}
