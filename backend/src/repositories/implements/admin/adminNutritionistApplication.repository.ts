import { PipelineStage, Types } from "mongoose";
import { BaseRepository } from "../common/base.repository";
import { IAdminNutritionistApplicationRepository } from "../../interfaces/admin/IAdminNutritionistApplicationRepository";
import {
  INutritionistProfile,
  NutritionistProfileModel,
} from "../../../models/nutritionistProfile.model";
import type { ApplicationStatus } from "../../../types/nutritionist.types";
import type { AdminNutritionistApplicationListQueryDto } from "../../../dtos/admin/nutritionistApplication/admin-nutritionist-application-list-query.dto";
import type { IAdminNutritionistApplicationListProjection } from "../../../types/admin/nutri-application/admin-nutritionist-application-list.projection";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { encodeCursor, decodeCursor } from "../../../utils/cursor.util";

type AdminNutritionistApplicationWithCursor =
  IAdminNutritionistApplicationListProjection & {
    cursorId: Types.ObjectId;
    cursorValue: Date;
  };

const ADMIN_NUTRITIONIST_APPLICATION_SORT_FIELD_MAP = {
  newest: "createdAt",
  oldest: "createdAt",
} as const;

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export class AdminNutritionistApplicationRepository
  extends BaseRepository<INutritionistProfile>
  implements IAdminNutritionistApplicationRepository
{
  constructor() {
    super(NutritionistProfileModel);
  }

  async getApplications(
    query: AdminNutritionistApplicationListQueryDto,
  ): Promise<
    CursorPaginationResult<IAdminNutritionistApplicationListProjection>
  > {
    const {
      search,
      applicationStatus,
      sortBy = "newest",
      cursor,
      limit = 12,
    } = query;

    const sortField = ADMIN_NUTRITIONIST_APPLICATION_SORT_FIELD_MAP[sortBy];

    const cursorData = decodeCursor(cursor);
    const isAscending = sortBy === "oldest";

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

    const keyword = search?.trim();

    if (keyword) {
      const escapedKeyword = escapeRegex(keyword);

      pipeline.push({
        $match: {
          $or: [
            {
              "user.fullName": {
                $regex: escapedKeyword,
                $options: "i",
              },
            },
            {
              "user.email": {
                $regex: escapedKeyword,
                $options: "i",
              },
            },
            {
              "user.username": {
                $regex: escapedKeyword,
                $options: "i",
              },
            },
          ],
        },
      });
    }

    if (cursorData) {
      if (
        cursorData.sortKey !== sortBy ||
        !Types.ObjectId.isValid(cursorData.id)
      ) {
        throw new Error("Invalid nutritionist application cursor.");
      }

      const cursorValue = new Date(cursorData.value);

      if (Number.isNaN(cursorValue.getTime())) {
        throw new Error("Invalid nutritionist application cursor date.");
      }

      const comparisonOperator = isAscending ? "$gt" : "$lt";

      pipeline.push({
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
                [comparisonOperator]: new Types.ObjectId(cursorData.id),
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
          _id: 1,
          userId: "$user._id",
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

    const results =
      await this._model.aggregate<AdminNutritionistApplicationWithCursor>(
        pipeline,
      );

    const hasMore = results.length > limit;
    const pageResults = hasMore ? results.slice(0, limit) : results;
    const lastItem = pageResults[pageResults.length - 1];

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            id: lastItem.cursorId.toString(),
            value: lastItem.cursorValue.toISOString(),
            sortKey: sortBy,
          })
        : null;

    const items = pageResults.map(
      ({ cursorId: _cursorId, cursorValue: _cursorValue, ...item }) => item,
    );

    return {
      items,
      nextCursor,
      hasMore,
    };
  }

  async updateApplicationStatus(
    userId: string,
    status: ApplicationStatus,
    rejectionReason?: string,
  ): Promise<boolean> {
    if (!Types.ObjectId.isValid(userId)) {
      return false;
    }

    const update: {
      $set: Record<string, unknown>;
      $unset?: Record<string, "">;
    } = {
      $set: {
        applicationStatus: status,
      },
    };

    if (status === "rejected" && rejectionReason?.trim()) {
      update.$set.rejectionReason = rejectionReason.trim();
    } else {
      update.$unset = {
        rejectionReason: "",
      };
    }

    const result = await this._model.updateOne(
      {
        userId: new Types.ObjectId(userId),
      },
      update,
    );

    return result.matchedCount > 0;
  }
}
