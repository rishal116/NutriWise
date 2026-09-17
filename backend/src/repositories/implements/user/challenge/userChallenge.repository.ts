import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";
import { ChallengeModel } from "../../../../models/challenge.model";
import {
  IUserChallenge,
  UserChallengeModel,
} from "../../../../models/userChallenge.model";
import { UserChallengeProgressModel } from "../../../../models/userChallengeProgress.model";
import { ChallengeDayModel } from "../../../../models/challengeDay.model";
import { IUserChallengeRepository } from "../../../interfaces/user/challenge/IUserChallengeRepository";
import { BaseRepository } from "../../common/base.repository";
import { encodeCursor, decodeCursor } from "../../../../utils/cursor.util";
import { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";
import {
  UserChallengeListQuery,
  UserChallengeSort,
} from "../../../../types/user/challenge/user-challenge-list-query.type";
import { UserChallengeListItem } from "../../../../types/user/challenge/user-challenge-list-item.type";
import { UserChallengeDetailsResult } from "../../../../types/user/challenge/user-challenge-details-result.type";

interface UserChallengeListWithCursor extends UserChallengeListItem {
  cursorId: Types.ObjectId;
  cursorValue: Date;
}

const USER_CHALLENGE_SORT_FIELD_MAP: Record<
  UserChallengeSort,
  {
    field: string;
    order: 1 | -1;
  }
> = {
  newest: {
    field: "createdAt",
    order: -1,
  },
  oldest: {
    field: "createdAt",
    order: 1,
  },
};

@injectable()
export class UserChallengeRepository
  extends BaseRepository<IUserChallenge>
  implements IUserChallengeRepository
{
  constructor() {
    super(UserChallengeModel);
  }

  async browseChallenges(
    userId: string,
    query: UserChallengeListQuery,
  ): Promise<CursorPaginationResult<UserChallengeListItem>> {
    const { cursor, limit = 12, search, status, sortBy = "newest" } = query;

    const userObjectId = new Types.ObjectId(userId);

    const decodedCursor = decodeCursor(cursor);

    const { field, order } = USER_CHALLENGE_SORT_FIELD_MAP[sortBy];

    const pipeline: PipelineStage[] = [
      {
        $match: {
          userId: userObjectId,
          ...(status ? { status } : {}),
        },
      },
      {
        $lookup: {
          from: ChallengeModel.collection.name,
          localField: "challengeId",
          foreignField: "_id",
          as: "challenge",
        },
      },
      {
        $unwind: "$challenge",
      },
    ];

    if (search?.trim()) {
      const searchText = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      pipeline.push({
        $match: {
          $or: [
            {
              "challenge.title": {
                $regex: searchText,
                $options: "i",
              },
            },
            {
              "challenge.description": {
                $regex: searchText,
                $options: "i",
              },
            },
          ],
        },
      });
    }

    if (decodedCursor) {
      const cursorValue = new Date(decodedCursor.value);
      const cursorId = new Types.ObjectId(decodedCursor.id);

      pipeline.push({
        $match: {
          $or: [
            {
              [field]: {
                [order === 1 ? "$gt" : "$lt"]: cursorValue,
              },
            },
            {
              [field]: cursorValue,
              _id: {
                [order === 1 ? "$gt" : "$lt"]: cursorId,
              },
            },
          ],
        },
      });
    }

    pipeline.push(
      {
        $sort: {
          [field]: order,
          _id: order,
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

          challengeId: {
            $toString: "$challengeId",
          },

          title: "$challenge.title",

          thumbnailUrl: "$challenge.thumbnailUrl",

          category: "$challenge.category",

          difficulty: "$challenge.difficulty",

          accessType: "$challenge.accessType",

          durationDays: "$challenge.durationDays",

          status: 1,

          currentDay: 1,

          progressPercentage: 1,

          currentStreak: 1,

          longestStreak: 1,

          joinedAt: 1,

          completedAt: 1,

          cursorId: "$_id",

          cursorValue: "$createdAt",
        },
      },
    );

    const result =
      await this._model.aggregate<UserChallengeListWithCursor>(pipeline);

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

  async findByIdAndUser(
    userChallengeId: string,
    userId: string,
  ): Promise<UserChallengeDetailsResult | null> {
    if (
      !Types.ObjectId.isValid(userChallengeId) ||
      !Types.ObjectId.isValid(userId)
    ) {
      return null;
    }

    const userChallengeObjectId = new Types.ObjectId(userChallengeId);

    const userObjectId = new Types.ObjectId(userId);

    const result = await this._model.aggregate<UserChallengeDetailsResult>([
      {
        $match: {
          _id: userChallengeObjectId,
          userId: userObjectId,
        },
      },

      {
        $lookup: {
          from: ChallengeModel.collection.name,
          localField: "challengeId",
          foreignField: "_id",
          as: "challenge",
        },
      },

      {
        $unwind: "$challenge",
      },

      {
        $lookup: {
          from: ChallengeDayModel.collection.name,
          let: {
            challengeId: "$challengeId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$challengeId", "$$challengeId"],
                },
              },
            },
            {
              $sort: {
                dayNumber: 1,
              },
            },
            {
              $project: {
                _id: 0,

                id: {
                  $toString: "$_id",
                },

                dayNumber: 1,

                title: 1,

                description: 1,

                activities: {
                  $map: {
                    input: "$activities",
                    as: "activity",
                    in: {
                      id: {
                        $toString: "$$activity._id",
                      },

                      type: "$$activity.type",
                      title: "$$activity.title",
                      description: "$$activity.description",
                      instructions: "$$activity.instructions",
                      valueType: "$$activity.valueType",
                      targetValue: "$$activity.targetValue",
                      unit: "$$activity.unit",
                      estimatedDurationMinutes:
                        "$$activity.estimatedDurationMinutes",
                      imageUrl: "$$activity.imageUrl",
                      videoUrl: "$$activity.videoUrl",
                      isRequired: "$$activity.isRequired",
                      order: "$$activity.order",
                    },
                  },
                },
              },
            },
          ],
          as: "days",
        },
      },

      {
        $lookup: {
          from: UserChallengeProgressModel.collection.name,
          let: {
            userChallengeId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$userChallengeId", "$$userChallengeId"],
                },
              },
            },
            {
              $sort: {
                completedAt: 1,
              },
            },
            {
              $project: {
                _id: 0,

                id: {
                  $toString: "$_id",
                },

                challengeDayId: {
                  $toString: "$challengeDayId",
                },

                activityId: {
                  $toString: "$activityId",
                },

                completedAt: 1,
              },
            },
          ],
          as: "progress",
        },
      },

      {
        $project: {
          _id: 0,

          id: {
            $toString: "$_id",
          },

          status: 1,
          joinedAt: 1,
          startedAt: 1,
          currentDay: 1,
          progressPercentage: 1,
          currentStreak: 1,
          longestStreak: 1,
          completedAt: 1,

          challenge: {
            id: {
              $toString: "$challenge._id",
            },

            title: "$challenge.title",
            description: "$challenge.description",
            instructions: "$challenge.instructions",
            coverImageUrl: "$challenge.coverImageUrl",
            category: "$challenge.category",
            difficulty: "$challenge.difficulty",
            accessType: "$challenge.accessType",
            durationDays: "$challenge.durationDays",
          },

          days: 1,

          progress: 1,
        },
      },

      {
        $limit: 1,
      },
    ]);

    return result[0] ?? null;
  }

  async findByUserAndChallenge(
    userId: string,
    challengeId: string,
  ): Promise<IUserChallenge | null> {
    if (
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(challengeId)
    ) {
      return null;
    }

    return this._model
      .findOne({
        userId: new Types.ObjectId(userId),
        challengeId: new Types.ObjectId(challengeId),
      })
      .lean<IUserChallenge | null>()
      .exec();
  }
}
