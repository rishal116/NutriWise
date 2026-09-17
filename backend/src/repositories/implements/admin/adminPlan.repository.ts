import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";

import {
  NutritionistPlanModel,
  INutritionistPlan,
} from "../../../models/nutritionistPlan.model";

import { UserModel } from "../../../models/user.model";

import { BaseRepository } from "../../implements/common/base.repository";

import { IAdminPlanRepository } from "../../interfaces/admin/IAdminPlanRepository";

import { AdminPlanListQueryDTO } from "../../../dtos/admin/plan/admin-plan-list-query.dto";

import { IAdminPlanListProjection } from "../../../types/admin/plan/admin-plan-list.projection";

import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

import { encodeCursor, decodeCursor } from "../../../utils/cursor.util";

const ADMIN_PLAN_SORT_FIELD_MAP = {
  newest: "createdAt",
  oldest: "createdAt",
} as const;

interface AdminPlanListWithCursor extends IAdminPlanListProjection {
  cursorId: Types.ObjectId;
  cursorValue: Date;
}

@injectable()
export class AdminPlanRepository
  extends BaseRepository<INutritionistPlan>
  implements IAdminPlanRepository
{
  constructor() {
    super(NutritionistPlanModel);
  }

  async findPlans(
    query: AdminPlanListQueryDTO,
  ): Promise<CursorPaginationResult<IAdminPlanListProjection>> {
    const { search, status, sortBy = "newest", cursor, limit = 12 } = query;

    const decodedCursor = decodeCursor(cursor);

    const pipeline: PipelineStage[] = [
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: "nutritionistId",
          foreignField: "_id",
          as: "nutritionist",
        },
      },
      {
        $unwind: {
          path: "$nutritionist",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    if (status) {
      pipeline.push({
        $match: {
          status,
        },
      });
    }

    if (search?.trim()) {
      const escapedSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      pipeline.push({
        $match: {
          $or: [
            {
              title: {
                $regex: escapedSearch,
                $options: "i",
              },
            },
            {
              specialization: {
                $regex: escapedSearch,
                $options: "i",
              },
            },
            {
              "nutritionist.fullName": {
                $regex: escapedSearch,
                $options: "i",
              },
            },
          ],
        },
      });
    }

    const sortField = ADMIN_PLAN_SORT_FIELD_MAP[sortBy];
    const isAscending = sortBy === "oldest";

    if (decodedCursor) {
      const cursorValue = new Date(decodedCursor.value);
      const cursorId = new Types.ObjectId(decodedCursor.id);

      pipeline.push({
        $match: {
          $or: [
            {
              [sortField]: {
                [isAscending ? "$gt" : "$lt"]: cursorValue,
              },
            },
            {
              [sortField]: cursorValue,
              _id: {
                [isAscending ? "$gt" : "$lt"]: cursorId,
              },
            },
          ],
        },
      });
    }

    pipeline.push(
      {
        $sort: {
          [sortField]: isAscending ? 1 : -1,
          _id: isAscending ? 1 : -1,
        },
      },
      {
        $limit: limit + 1,
      },
      {
        $project: {
          _id: 0,

          id: {
            $toString: "$_id",
          },

          nutritionistId: {
            $toString: "$nutritionistId",
          },

          nutritionist: {
            fullName: {
              $ifNull: ["$nutritionist.fullName", "Unknown Nutritionist"],
            },
            profileImage: "$nutritionist.profileImage",
          },

          title: 1,
          specialization: 1,
          durationDays: 1,
          price: 1,
          currency: 1,
          status: 1,
          createdAt: 1,

          cursorId: "$_id",
          cursorValue: "$createdAt",
        },
      },
    );

    const result =
      await this._model.aggregate<AdminPlanListWithCursor>(pipeline);

    const hasMore = result.length > limit;

    const items = hasMore ? result.slice(0, limit) : result;

    const lastItem = items[items.length - 1];

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            id: lastItem.cursorId.toString(),
            value: lastItem.cursorValue.toISOString(),
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

  async archivePlan(planId: string): Promise<IAdminPlanListProjection | null> {
    if (!Types.ObjectId.isValid(planId)) {
      return null;
    }

    const plan = await this._model
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(planId),
          isDeleted: false,
          status: {
            $in: ["draft", "published"],
          },
        },
        {
          $set: {
            status: "archived",
          },
        },
        {
          new: true,
          projection: {
            _id: 1,
            nutritionistId: 1,
            title: 1,
            specialization: 1,
            durationDays: 1,
            price: 1,
            currency: 1,
            status: 1,
            createdAt: 1,
          },
        },
      )
      .lean()
      .exec();

    if (!plan) {
      return null;
    }

    const nutritionist = await UserModel.findById(plan.nutritionistId)
      .select({
        fullName: 1,
        profileImage: 1,
      })
      .lean()
      .exec();

    return {
      id: plan._id.toString(),
      nutritionistId: plan.nutritionistId.toString(),

      nutritionist: {
        fullName: nutritionist?.fullName ?? "Unknown Nutritionist",
        profileImage: nutritionist?.profileImage,
      },

      title: plan.title,
      specialization: plan.specialization,
      durationDays: plan.durationDays,
      price: plan.price,
      currency: plan.currency,
      status: plan.status,
      createdAt: plan.createdAt,
    };
  }
}
