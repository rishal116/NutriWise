import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";
import { ChallengeModel, IChallenge } from "../../../models/challenge.model";
import { ChallengeDayModel } from "../../../models/challengeDay.model";
import { UserChallengeModel } from "../../../models/userChallenge.model";
import { IPublicChallengeRepository } from "../../interfaces/public/IPublicChallengeRepository";
import { BaseRepository } from "../common/base.repository";
import { PublicChallengeListItem } from "../../../types/public/challenge/public-challenge-list-item.type";
import { PublicChallengeDetailsResult } from "../../../types/public/challenge/public-challenge-details-result.type";
import {
  PublicChallengeDayListItem,
  PublicChallengeDayResult,
} from "../../../types/public/challenge-day/public-challenge-day-result.type";
import { PublicChallengeSection } from "../../../types/public/challenge/public-challenge-section.type";
import { PublicChallengeSectionQuery } from "../../../types/public/challenge/public-challenge-section-query.type";
import { PublicChallengeParticipationResult } from "../../../types/public/challenge/public-challenge-participation-result.type";

@injectable()
export class PublicChallengeRepository
  extends BaseRepository<IChallenge>
  implements IPublicChallengeRepository
{
  constructor() {
    super(ChallengeModel);
  }

  async findChallengeSection(
    section: PublicChallengeSection,
    query: PublicChallengeSectionQuery,
  ): Promise<PublicChallengeListItem[]> {
    const { category, difficulty, accessType, limit } = query;

    const challengeMatch: Record<string, unknown> = {
      status: "published",
    };

    if (category) {
      challengeMatch.category = category;
    }

    if (difficulty) {
      challengeMatch.difficulty = difficulty;
    }

    if (accessType) {
      challengeMatch.accessType = accessType;
    }

    if (section === "premium" || section === "free") {
      challengeMatch.accessType = section;
    }

    if (section === "new" || section === "premium" || section === "free") {
      return this._findStandardChallengeSection(challengeMatch, limit);
    }

    if (section === "popular") {
      return this._findRankedChallengeSection(challengeMatch, limit, false);
    }

    return this._findRankedChallengeSection(challengeMatch, limit, true);
  }

  private async _findStandardChallengeSection(
    challengeMatch: Record<string, unknown>,
    limit: number,
  ): Promise<PublicChallengeListItem[]> {
    return this._model.aggregate<PublicChallengeListItem>([
      {
        $match: challengeMatch,
      },
      {
        $sort: {
          createdAt: -1,
          _id: -1,
        },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 0,
          id: {
            $toString: "$_id",
          },
          title: 1,
          description: 1,
          thumbnailUrl: 1,
          category: 1,
          difficulty: 1,
          accessType: 1,
          durationDays: 1,
        },
      },
    ]);
  }

  private async _findRankedChallengeSection(
    challengeMatch: Record<string, unknown>,
    limit: number,
    trending: boolean,
  ): Promise<PublicChallengeListItem[]> {
    const userChallengeMatch: Record<string, unknown> = {};

    if (trending) {
      const since = new Date();

      since.setDate(since.getDate() - 7);

      userChallengeMatch.joinedAt = {
        $gte: since,
      };
    }

    const rankingField = trending ? "recentParticipants" : "participantCount";

    const groupStage: PipelineStage.Group = {
      $group: {
        _id: "$challengeId",
        [rankingField]: {
          $sum: 1,
        },
      },
    };

    const lookupStage: PipelineStage.Lookup = {
      $lookup: {
        from: ChallengeModel.collection.name,
        localField: "_id",
        foreignField: "_id",
        as: "challenge",
      },
    };

    const unwindStage: PipelineStage.Unwind = {
      $unwind: "$challenge",
    };

    const matchStage: PipelineStage.Match = {
      $match: challengeMatch,
    };

    const sortStage: PipelineStage.Sort = {
      $sort: {
        [rankingField]: -1,
        _id: -1,
      },
    };

    const projectStage: PipelineStage.Project = {
      $project: {
        _id: 0,
        id: {
          $toString: "$challenge._id",
        },
        title: "$challenge.title",
        description: "$challenge.description",
        thumbnailUrl: "$challenge.thumbnailUrl",
        category: "$challenge.category",
        difficulty: "$challenge.difficulty",
        accessType: "$challenge.accessType",
        durationDays: "$challenge.durationDays",
      },
    };

    const pipeline: PipelineStage[] = [];

    if (Object.keys(userChallengeMatch).length > 0) {
      pipeline.push({
        $match: userChallengeMatch,
      });
    }

    pipeline.push(
      groupStage,
      lookupStage,
      unwindStage,
      matchStage,
      sortStage,
      {
        $limit: limit,
      },
      projectStage,
    );

    return UserChallengeModel.aggregate<PublicChallengeListItem>(pipeline);
  }

  async findChallengeById(
    challengeId: string,
  ): Promise<PublicChallengeDetailsResult | null> {
    if (!Types.ObjectId.isValid(challengeId)) {
      return null;
    }

    const result = await this._model.aggregate<PublicChallengeDetailsResult>([
      {
        $match: {
          _id: new Types.ObjectId(challengeId),
          status: "published",
        },
      },
      {
        $project: {
          _id: 0,
          id: {
            $toString: "$_id",
          },
          title: 1,
          description: 1,
          instructions: 1,
          coverImageUrl: 1,
          category: 1,
          difficulty: 1,
          accessType: 1,
          durationDays: 1,
        },
      },
    ]);

    return result[0] ?? null;
  }

  async findUserChallenge(
    userId: string,
    challengeId: string,
  ): Promise<PublicChallengeParticipationResult | null> {
    if (
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(challengeId)
    ) {
      return null;
    }

    const result =
      await UserChallengeModel.aggregate<PublicChallengeParticipationResult>([
        {
          $match: {
            userId: new Types.ObjectId(userId),
            challengeId: new Types.ObjectId(challengeId),
          },
        },
        {
          $project: {
            _id: 0,
            userChallengeId: { $toString: "$_id" },
            status: 1,
            currentDay: 1,
            progressPercentage: 1,
            currentStreak: 1,
            longestStreak: 1,
          },
        },
        {
          $limit: 1,
        },
      ]);

    return result[0] ?? null;
  }

  async findChallengeDays(
    challengeId: string,
  ): Promise<PublicChallengeDayListItem[]> {
    if (!Types.ObjectId.isValid(challengeId)) {
      return [];
    }

    return ChallengeDayModel.aggregate<PublicChallengeDayListItem>([
      {
        $match: {
          challengeId: new Types.ObjectId(challengeId),
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
        },
      },
    ]);
  }

  async findChallengeDayById(
    challengeId: string,
    dayId: string,
  ): Promise<PublicChallengeDayResult | null> {
    if (
      !Types.ObjectId.isValid(challengeId) ||
      !Types.ObjectId.isValid(dayId)
    ) {
      return null;
    }

    const result = await ChallengeDayModel.aggregate<PublicChallengeDayResult>([
      {
        $match: {
          _id: new Types.ObjectId(dayId),
          challengeId: new Types.ObjectId(challengeId),
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
                estimatedDurationMinutes: "$$activity.estimatedDurationMinutes",
                imageUrl: "$$activity.imageUrl",
                videoUrl: "$$activity.videoUrl",
                isRequired: "$$activity.isRequired",
                order: "$$activity.order",
              },
            },
          },
        },
      },
    ]);

    return result[0] ?? null;
  }
}
