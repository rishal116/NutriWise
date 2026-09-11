import { PipelineStage, Types } from "mongoose";

import { BaseRepository } from "../common/base.repository";

import { IAdminNutritionistApplicationRepository } from "../../interfaces/admin/IAdminNutritionistApplicationRepository";

import {
  INutritionistProfile,
  NutritionistProfileModel,
} from "../../../models/nutritionistProfile.model";

import { ApplicationStatus } from "../../../types/nutritionist.types";

import { AdminNutritionistApplicationListQueryDto } from "../../../dtos/admin/nutritionistApplication/admin-nutritionist-application-list-query.dto";

import { AdminNutritionistApplicationListItemDto } from "../../../dtos/admin/nutritionistApplication/admin-nutritionist-application-list-item.dto";

import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

import { encodeCursor, decodeCursor } from "../../../utils/cursor.util";

type AdminNutritionistApplicationWithCursor =
  AdminNutritionistApplicationListItemDto & {
    cursorId: Types.ObjectId;
    cursorValue: Date;
  };

const ADMIN_NUTRITIONIST_APPLICATION_SORT_FIELD_MAP = {
  newest: "createdAt",
  oldest: "createdAt",
} as const;

export class AdminNutritionistApplicationRepository
  extends BaseRepository<INutritionistProfile>
  implements IAdminNutritionistApplicationRepository
{
  constructor() {
    super(NutritionistProfileModel);
  }

  async getApplications(
    query: AdminNutritionistApplicationListQueryDto,
  ): Promise<CursorPaginationResult<AdminNutritionistApplicationListItemDto>> {
    const {
      search,
      applicationStatus,
      sortBy = "newest",
      cursor,
      limit = 12,
    } = query;

    const sortField = ADMIN_NUTRITIONIST_APPLICATION_SORT_FIELD_MAP[sortBy];

    const cursorData = decodeCursor(cursor);

    const profileMatch: Record<string, unknown> = {};

    if (applicationStatus) {
      profileMatch.applicationStatus = applicationStatus;
    }

    const pipeline: PipelineStage[] = [
      {
        $match: profileMatch,
      },

      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: "$user",
      },

      {
        $match: {
          "user.deletedAt": null,
        },
      },
    ];

    if (search?.trim()) {
      const keyword = search.trim();

      pipeline.push({
        $match: {
          $or: [
            {
              "user.fullName": {
                $regex: keyword,
                $options: "i",
              },
            },
            {
              "user.email": {
                $regex: keyword,
                $options: "i",
              },
            },
            {
              "user.username": {
                $regex: keyword,
                $options: "i",
              },
            },
          ],
        },
      });
    }

    const isAscending = sortBy === "oldest";

    if (cursorData) {
      const cursorValue = new Date(cursorData.value);

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
                [isAscending ? "$gt" : "$lt"]: new Types.ObjectId(
                  cursorData.id,
                ),
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

          userId: {
            $toString: "$user._id",
          },

          fullName: "$user.fullName",
          email: "$user.email",
          profileImage: "$user.profileImage",

          applicationStatus: 1,
          createdAt: 1,

          cursorId: "$_id",
          cursorValue: `$${sortField}`,
        },
      },
    );

    const result =
      await this._model.aggregate<AdminNutritionistApplicationWithCursor>(
        pipeline,
      );

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

    const cleanItems = items.map(
      ({ cursorId: _cursorId, cursorValue: _cursorValue, ...application }) =>
        application,
    );

    return {
      items: cleanItems,
      nextCursor,
      hasMore,
    };
  }

  async updateApplicationStatus(
    userId: string,
    status: ApplicationStatus,
    rejectionReason?: string,
  ): Promise<void> {
    await this._model.updateOne(
      {
        userId: new Types.ObjectId(userId),
      },
      {
        $set: {
          applicationStatus: status,
          rejectionReason: status === "rejected" ? rejectionReason : undefined,
        },

        $unset:
          status === "approved"
            ? {
                rejectionReason: "",
              }
            : {},
      },
    );
  }
}
