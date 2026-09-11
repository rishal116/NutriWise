import { PipelineStage, Types } from "mongoose";

import { BaseRepository } from "../common/base.repository";

import { IAdminNutritionistRepository } from "../../interfaces/admin/IAdminNutritionistRepository";

import {
  INutritionistProfile,
  NutritionistProfileModel,
} from "../../../models/nutritionistProfile.model";

import { CoachLevel } from "../../../types/nutritionist.types";

import { AdminNutritionistListItemDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-list-item.dto";

import { AdminNutritionistDetailsDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-details.dto";

import { AdminNutritionistListQueryDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-list-query.dto";

import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

import { encodeCursor, decodeCursor } from "../../../utils/cursor.util";

type AdminNutritionistListItemWithCursor = AdminNutritionistListItemDto & {
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
  ): Promise<CursorPaginationResult<AdminNutritionistListItemDto>> {
    const {
      search,
      coachLevel,
      availabilityStatus,
      applicationStatus,
      isBlocked,
      sortBy = "newest",
      cursor,
      limit = 12,
    } = query;

    const cursorData = decodeCursor(cursor);

    const nutritionistMatch: Record<string, unknown> = {};

    if (coachLevel) {
      nutritionistMatch.coachLevel = coachLevel;
    }

    if (availabilityStatus) {
      nutritionistMatch.availabilityStatus = availabilityStatus;
    }

    if (applicationStatus) {
      nutritionistMatch.applicationStatus = applicationStatus;
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
              "user.createdAt": {
                [isAscending ? "$gt" : "$lt"]: cursorValue,
              },
            },
            {
              "user.createdAt": cursorValue,
              "user._id": {
                [isAscending ? "$gt" : "$lt"]: new Types.ObjectId(
                  cursorData.id,
                ),
              },
            },
          ],
        },
      });
    }

    pipeline.push({
      $sort: {
        "user.createdAt": isAscending ? 1 : -1,
        "user._id": isAscending ? 1 : -1,
      },
    });

    pipeline.push({
      $limit: limit + 1,
    });

    pipeline.push({
      $project: {
        _id: 0,

        id: {
          $toString: "$user._id",
        },

        userId: {
          $toString: "$user._id",
        },

        fullName: "$user.fullName",
        email: "$user.email",
        username: "$user.username",
        profileImage: "$user.profileImage",

        isBlocked: "$user.isBlocked",

        coachLevel: 1,
        availabilityStatus: 1,

        totalExperienceYears: 1,
        rating: 1,
        totalReviews: 1,
        totalPeopleCoached: 1,

        createdAt: "$user.createdAt",

        cursorId: "$user._id",
        cursorValue: "$user.createdAt",
      },
    });

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
      ({ cursorId: _cursorId, cursorValue: _cursorValue, ...nutritionist }) =>
        nutritionist,
    );

    return {
      items: cleanItems,
      nextCursor,
      hasMore,
    };
  }

  async getNutritionistDetails(
    userId: string,
  ): Promise<AdminNutritionistDetailsDto | null> {
    const nutritionist =
      await this._model.aggregate<AdminNutritionistDetailsDto>([
        {
          $match: {
            userId: new Types.ObjectId(userId),
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
            _id: 0,

            id: {
              $toString: "$user._id",
            },

            userId: {
              $toString: "$user._id",
            },

            fullName: "$user.fullName",
            email: "$user.email",
            username: "$user.username",
            profileImage: "$user.profileImage",
            phone: "$user.phone",
            birthDate: "$user.birthDate",
            gender: "$user.gender",

            roles: "$user.roles",
            activeRole: "$user.activeRole",

            authProvider: "$user.authProvider",
            emailVerifiedAt: "$user.emailVerifiedAt",

            isBlocked: "$user.isBlocked",
            isProfileCompleted: "$user.isProfileCompleted",

            lastLoginAt: "$user.lastLoginAt",

            qualifications: 1,
            experiences: 1,
            certifications: 1,
            specializations: 1,
            languages: 1,
            bio: 1,
            resumeUrl: 1,

            totalExperienceYears: 1,
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

    return nutritionist[0] ?? null;
  }

  async updateCoachLevel(
    userId: string,
    coachLevel: CoachLevel,
  ): Promise<void> {
    await this._model.updateOne(
      {
        userId: new Types.ObjectId(userId),
      },
      {
        $set: {
          coachLevel,
        },
      },
    );
  }
}
