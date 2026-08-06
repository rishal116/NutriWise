import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";
import { APPLICATION_STATUSES } from "../../../../types/nutritionist.types";
import {
  INutritionistProfile,
  NutritionistProfileModel,
} from "../../../../models/nutritionistProfile.model";
import { INutritionistBrowsingRepository } from "../../../interfaces/user/discovery/INutriBrowsingRepository";
import { encodeCursor, decodeCursor } from "../../../../utils/cursor.util";
import { NutritionistListQueryDTO } from "../../../../dtos/user/nutri-browsing/nutri-list-query.dto";
import {
  NutritionistDetailResult,
  NutritionistBrowseStatsResult,
} from "../../../../types/nutri-browsing.types";
import { BaseRepository } from "../../common/base.repository";
import { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";
import { NutritionistCardDTO } from "../../../../dtos/user/nutri-browsing/nutri-card.dto";
import {
  AvailabilityStatus,
  CoachLevel,
  Language,
  Specialization,
} from "../../../../types/nutritionist.types";
import { Gender, UserRole } from "../../../../enums/user.enum";

const NUTRITIONIST_SORT_FIELD_MAP = {
  highest_rating: "rating",
  most_experienced: "totalExperienceYears",
  most_reviewed: "totalReviews",
  newest: "createdAt",
} as const;

type ProfileMatch = {
  applicationStatus: string;
  specializations?: Specialization;
  languages?: {
    $in: Language[];
  };
  coachLevel?: CoachLevel;
  availabilityStatus?: AvailabilityStatus;
  rating?: {
    $gte: number;
  };
};

type UserMatch = {
  "user.roles": UserRole;
  "user.isBlocked": boolean;
  "user.deletedAt": null;
  "user.gender"?: Gender;

  $or?: Array<
    | {
        "user.fullName": {
          $regex: string;
          $options: string;
        };
      }
    | {
        "user.username": {
          $regex: string;
          $options: string;
        };
      }
  >;
};

interface NutritionistCardWithCursor extends NutritionistCardDTO {
  cursorId: Types.ObjectId;
  cursorValue: number | Date;
}

@injectable()
export class NutritionistBrowsingRepository
  extends BaseRepository<INutritionistProfile>
  implements INutritionistBrowsingRepository
{
  constructor() {
    super(NutritionistProfileModel);
  }

  async findNutritionists(
    query: NutritionistListQueryDTO,
  ): Promise<CursorPaginationResult<NutritionistCardDTO>> {
    const {
      search,
      specialization,
      languages,
      coachLevel,
      gender,
      minRating,
      availableOnly,
      sortBy = "highest_rating",
      cursor,
      limit = 12,
    } = query;

    const sortField = NUTRITIONIST_SORT_FIELD_MAP[sortBy];

    const cursorData = decodeCursor(cursor);

    const pipeline: PipelineStage[] = [];

    const profileMatch: ProfileMatch = {
      applicationStatus: APPLICATION_STATUSES[1],
    };

    if (specialization) {
      profileMatch.specializations = specialization;
    }

    if (languages?.length) {
      profileMatch.languages = {
        $in: languages,
      };
    }

    if (coachLevel) {
      profileMatch.coachLevel = coachLevel;
    }

    if (availableOnly) {
      profileMatch.availabilityStatus = "available";
    }

    if (minRating !== undefined) {
      profileMatch.rating = {
        $gte: minRating,
      };
    }

    pipeline.push({
      $match: profileMatch,
    });

    pipeline.push({
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    });

    pipeline.push({
      $unwind: "$user",
    });

    const userMatch: UserMatch = {
      "user.roles": UserRole.NUTRITIONIST,
      "user.isBlocked": false,
      "user.deletedAt": null,
    };

    if (gender) {
      userMatch["user.gender"] = gender;
    }

    if (search) {
      userMatch.$or = [
        {
          "user.fullName": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "user.username": {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    pipeline.push({
      $match: userMatch,
    });

    if (cursorData) {
      let cursorValue: string | number | Date = cursorData.value;

      if (sortField === "createdAt") {
        cursorValue = new Date(cursorData.value);
      }

      pipeline.push({
        $match: {
          $or: [
            {
              [sortField]: {
                $lt: cursorValue,
              },
            },
            {
              [sortField]: cursorValue,

              _id: {
                $lt: new Types.ObjectId(cursorData.id),
              },
            },
          ],
        },
      });
    }

    pipeline.push({
      $sort: {
        [sortField]: -1,
        _id: -1,
      },
    });

    pipeline.push({
      $limit: limit + 1,
    });

    pipeline.push({
      $project: {
        _id: 0,
        id: {
          $toString: "$_id",
        },
        fullName: "$user.fullName",
        username:"$user.username",
        profileImage: "$user.profileImage",
        specializations: 1,
        coachLevel: 1,
        rating: 1,
        totalReviews: 1,
        totalExperienceYears: 1,
        cursorId: "$_id",
        cursorValue: `$${sortField}`,
      },
    });

    const result =
      await this._model.aggregate<NutritionistCardWithCursor>(pipeline);

    const hasMore = result.length > limit;

    const items = hasMore ? result.slice(0, limit) : result;

    const lastItem = items[items.length - 1];

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            id: lastItem.cursorId.toString(),
            value:
              lastItem.cursorValue instanceof Date
                ? lastItem.cursorValue.toISOString()
                : lastItem.cursorValue,

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

  async findNutritionistByUsername(
    username: string,
  ): Promise<NutritionistDetailResult | null> {
    const result = await NutritionistProfileModel.aggregate([
      {
        $match: {
          applicationStatus: APPLICATION_STATUSES[1],
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
          "user.username": username,
          "user.roles": UserRole.NUTRITIONIST,
          "user.isBlocked": false,
          "user.deletedAt": null,
        },
      },

      {
        $project: {
          _id: 1,

          qualifications: 1,
          specializations: 1,
          experiences: 1,
          bio: 1,
          languages: 1,
          availabilityStatus: 1,
          resumeUrl: 1,
          certifications: 1,
          totalExperienceYears: 1,
          coachLevel: 1,
          rating: 1,
          totalReviews: 1,
          totalPeopleCoached: 1,
          createdAt: 1,

          user: {
            _id: "$user._id",
            username: "$user.username",
            fullName: "$user.fullName",
            profileImage: "$user.profileImage",
            email: "$user.email",
          },
        },
      },
    ]);

    if (!result.length) {
      return null;
    }

    return {
      user: result[0].user,
      profile: {
        ...result[0],
        user: undefined,
      },
    };
  }

  async getBrowseStatistics(): Promise<NutritionistBrowseStatsResult> {
    const result = await this._model.aggregate<{
      totalNutritionists: number;
      averageRating: number;
      totalReviews: number;
      totalPeopleCoached: number;
    }>([
      {
        $match: {
          applicationStatus: APPLICATION_STATUSES[1],
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
          "user.roles": UserRole.NUTRITIONIST,
          "user.isBlocked": false,
          "user.deletedAt": null,
        },
      },
      {
        $group: {
          _id: null,

          totalNutritionists: {
            $sum: 1,
          },

          averageRating: {
            $avg: "$rating",
          },

          totalReviews: {
            $sum: "$totalReviews",
          },

          totalPeopleCoached: {
            $sum: "$totalPeopleCoached",
          },
        },
      },
      {
        $project: {
          _id: 0,

          totalNutritionists: 1,

          averageRating: {
            $round: ["$averageRating", 1],
          },

          totalReviews: 1,

          totalPeopleCoached: 1,
        },
      },
    ]);

    if (!result.length) {
      return {
        totalNutritionists: 0,
        averageRating: 0,
        totalReviews: 0,
        totalPeopleCoached: 0,
      };
    }

    return result[0];
  }
}
