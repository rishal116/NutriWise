import { PipelineStage, Types } from "mongoose";
import { BaseRepository } from "../common/base.repository";
import { IAdminNutritionistRepository } from "../../interfaces/admin/IAdminNutritionistRepository";
import {
  INutritionistProfile,
  NutritionistProfileModel,
} from "../../../models/nutritionistProfile.model";
import type { CoachLevel } from "../../../types/nutritionist.types";
import type { IAdminNutritionistListProjection } from "../../../types/admin/nutritionist/admin-nutri-list.projection";
import type { IAdminNutritionistDetailsProjection } from "../../../types/admin/nutritionist/admin-nutritionist-details.projection";
import type { AdminNutritionistListQueryDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-list-query.dto";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { encodeCursor, decodeCursor } from "../../../utils/cursor.util";

type AdminNutritionistListItemWithCursor = IAdminNutritionistListProjection & {
  cursorId: Types.ObjectId;
  cursorValue: Date;
};

export class AdminNutritionistRepository
  extends BaseRepository<INutritionistProfile>
  implements IAdminNutritionistRepository
{
  constructor() {
    super(NutritionistProfileModel);
  }

  async getNutritionists(
    query: AdminNutritionistListQueryDto,
  ): Promise<CursorPaginationResult<IAdminNutritionistListProjection>> {
    const {
      search,
      coachLevel,
      isBlocked,
      sortBy = "newest",
      cursor,
      limit = 12,
    } = query;

    const cursorData = decodeCursor(cursor);
    const isAscending = sortBy === "oldest";
    const comparisonOperator = isAscending ? "$gt" : "$lt";

    const nutritionistMatch: Record<string, unknown> = {
      applicationStatus: "approved",
    };

    if (coachLevel) {
      nutritionistMatch.coachLevel = coachLevel;
    }

    const pipeline: PipelineStage[] = [
      {
        $match: nutritionistMatch,
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

    if (typeof isBlocked === "boolean") {
      pipeline.push({
        $match: {
          "user.isBlocked": isBlocked,
        },
      });
    }

    if (search?.trim()) {
      const keyword = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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

    if (cursorData) {
      const cursorValue = new Date(cursorData.value);

      if (
        !Types.ObjectId.isValid(cursorData.id) ||
        Number.isNaN(cursorValue.getTime())
      ) {
        throw new Error("Invalid nutritionist pagination cursor.");
      }

      const cursorId = new Types.ObjectId(cursorData.id);

      pipeline.push({
        $match: {
          $or: [
            {
              createdAt: {
                [comparisonOperator]: cursorValue,
              },
            },
            {
              createdAt: cursorValue,
              _id: {
                [comparisonOperator]: cursorId,
              },
            },
          ],
        },
      });
    }

    pipeline.push(
      {
        $sort: {
          createdAt: isAscending ? 1 : -1,
          _id: isAscending ? 1 : -1,
        },
      },
      {
        $limit: limit + 1,
      },
      {
        $project: {
          _id: 1,
          userId: 1,

          fullName: "$user.fullName",
          email: "$user.email",
          username: "$user.username",
          profileImage: "$user.profileImage",
          isBlocked: "$user.isBlocked",

          coachLevel: 1,
          rating: 1,
          totalReviews: 1,
          createdAt: 1,

          cursorId: "$_id",
          cursorValue: "$createdAt",
        },
      },
    );

    const result =
      await this._model.aggregate<AdminNutritionistListItemWithCursor>(
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
      ({ cursorId: _cursorId, cursorValue: _cursorValue, ...item }) => item,
    );

    return {
      items: cleanItems,
      nextCursor,
      hasMore,
    };
  }

  async getNutritionistDetails(
    userId: string,
  ): Promise<IAdminNutritionistDetailsProjection | null> {
    if (!Types.ObjectId.isValid(userId)) {
      return null;
    }

    const nutritionists =
      await this._model.aggregate<IAdminNutritionistDetailsProjection>([
        {
          $match: {
            userId: new Types.ObjectId(userId),
            applicationStatus: {
              $in: ["pending", "approved", "rejected"],
            },
          },
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
        {
          $project: {
            _id: 1,
            userId: "$user._id",

            fullName: "$user.fullName",
            email: "$user.email",
            username: "$user.username",
            profileImage: "$user.profileImage",
            gender: "$user.gender",

            roles: "$user.roles",
            activeRole: "$user.activeRole",
            isBlocked: "$user.isBlocked",
            isProfileCompleted: "$user.isProfileCompleted",

            qualifications: 1,
            experiences: 1,
            certifications: 1,
            specializations: 1,
            languages: 1,
            bio: 1,
            resumeUrl: 1,

            totalExperienceYears: {
              $sum: {
                $map: {
                  input: { $ifNull: ["$experiences", []] },
                  as: "experience",
                  in: {
                    $ifNull: ["$$experience.durationYears", 0],
                  },
                },
              },
            },

            availabilityStatus: 1,
            applicationStatus: 1,
            rejectionReason: 1,
            coachLevel: 1,
            rating: 1,
            totalReviews: 1,
            totalPeopleCoached: 1,

            createdAt: 1,
            updatedAt: 1,
          },
        },
      ]);

    return nutritionists[0] ?? null;
  }

  async updateCoachLevel(
    userId: string,
    coachLevel: CoachLevel,
  ): Promise<void> {
    if (!Types.ObjectId.isValid(userId)) {
      return;
    }

    await this._model.updateOne(
      {
        userId: new Types.ObjectId(userId),
        applicationStatus: "approved",
      },
      {
        $set: {
          coachLevel,
        },
      },
    );
  }
}
