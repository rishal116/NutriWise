import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";
import { UserRole } from "../../../enums/user.enum";
import { APPLICATION_STATUSES } from "../../../types/nutritionist.types";
import {
  INutritionistProfile,
  NutritionistProfileModel,
} from "../../../models/nutritionistProfile.model";
import { INutritionistBrowsingRepository } from "../../interfaces/user/INutriBrowsingRepository";
import { encodeCursor, decodeCursor } from "../../../utils/cursor.util";
import { NutritionistListQueryDTO } from "../../../dtos/user/nutri-browsing/nutri-list-query.dto";
import { NutritionistCardDTO } from "../../../dtos/user/nutri-browsing/nutri-card.dto";
import {
  NutritionistDetailResult,
  NutritionistBrowseResult,
  NutritionistBrowseStatsResult,
} from "../../../types/nutri-browsing.types";
import { BaseRepository } from "../common/base.repository";

type ProfileMatch = {
  applicationStatus: string;
  specializations?: {
    $in: string[];
  };
  languages?: {
    $in: string[];
  };
  coachLevel?: {
    $in: string[];
  };
  availabilityStatus?: {
    $in: string[];
  };
  rating?: {
    $gte: number;
  };
};

type UserMatch = {
  "user.roles": UserRole;
  "user.isBlocked": boolean;
  "user.deletedAt": null;

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
  cursorValue: number;
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
  ): Promise<NutritionistBrowseResult> {
    const {
      search,
      specializations,
      languages,
      coachLevels,
      availabilityStatuses,
      minRating,
      sortBy = "rating",
      cursor,
      limit = 12,
    } = query;

    const cursorData = decodeCursor(cursor);

    const sortField =
      sortBy === "experience"
        ? "totalExperienceYears"
        : sortBy === "reviews"
          ? "totalReviews"
          : "rating";

    const pipeline: PipelineStage[] = [];

    const profileMatch: ProfileMatch = {
      applicationStatus: APPLICATION_STATUSES[1],
    };

    if (specializations?.length) {
      profileMatch.specializations = {
        $in: specializations,
      };
    }

    if (languages?.length) {
      profileMatch.languages = {
        $in: languages,
      };
    }

    if (coachLevels?.length) {
      profileMatch.coachLevel = {
        $in: coachLevels,
      };
    }

    if (availabilityStatuses?.length) {
      profileMatch.availabilityStatus = {
        $in: availabilityStatuses,
      };
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
      pipeline.push({
        $match: {
          $or: [
            {
              [sortField]: {
                $lt: cursorData.value,
              },
            },
            {
              [sortField]: cursorData.value,
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

        username: "$user.username",
        fullName: "$user.fullName",
        profileImage: "$user.profileImage",

        specializations: 1,
        coachLevel: 1,
        rating: 1,
        totalReviews: 1,
        totalExperienceYears: 1,
        availabilityStatus: 1,

        cursorId: "$_id",
        cursorValue: `$${sortField}`,
      },
    });

    const result =
      await this._model.aggregate<NutritionistCardWithCursor>(pipeline);

    const hasMore = result.length > limit;

    const items = hasMore ? result.slice(0, limit) : result;

    const nextCursor = hasMore
      ? encodeCursor({
          value: items[items.length - 1].cursorValue,
          id: items[items.length - 1].cursorId.toString(),
        })
      : null;

    const browseItems = items.map(
      ({ cursorId: _cursorId, cursorValue: _cursorValue, ...item }) => item,
    );

    return {
      items: browseItems,
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
