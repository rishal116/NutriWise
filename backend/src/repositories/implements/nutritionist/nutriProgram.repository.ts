import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";
import { INutriProgramRepository } from "../../interfaces/nutritionist/INutriProgramRepository";
import { BaseRepository } from "../common/base.repository";
import {
  IUserProgram,
  UserProgramModel,
} from "../../../models/userProgram.model";
import {
  GetProgramsQueryDTO,
  ProgramSortBy,
} from "../../../dtos/nutritionist/program/program-request.dto";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { decodeCursor, encodeCursor } from "../../../utils/cursor.util";
import { IUserProgramCardProjection } from "../../../types/nutritionist/program/program-card.projection";
import { IUserProgramDetailsProjection } from "../../../types/nutritionist/program/program-details.projection";

interface ProgramProjectionWithCursor extends IUserProgramCardProjection {
  cursorId: Types.ObjectId;
  cursorValue: string | number | Date;
}

@injectable()
export class NutriProgramRepository
  extends BaseRepository<IUserProgram>
  implements INutriProgramRepository
{
  constructor() {
    super(UserProgramModel);
  }

  async findPrograms(
    nutritionistId: string | Types.ObjectId,
    query: GetProgramsQueryDTO,
  ): Promise<CursorPaginationResult<IUserProgramCardProjection>> {
    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const {
      cursor,
      limit = 10,
      search,
      programStatus,
      subscriptionStatus,
      sortBy = ProgramSortBy.LATEST,
    } = query;

    const cursorData = decodeCursor(cursor);

    let sortField:
      | "createdAt"
      | "startDate"
      | "endDate"
      | "completionPercentage" = "createdAt";
    let sortDirection: 1 | -1 = -1;

    switch (sortBy) {
      case ProgramSortBy.OLDEST:
        sortField = "createdAt";
        sortDirection = 1;
        break;

      case ProgramSortBy.START_DATE:
        sortField = "startDate";
        sortDirection = -1;
        break;

      case ProgramSortBy.END_DATE:
        sortField = "endDate";
        sortDirection = -1;
        break;

      case ProgramSortBy.PROGRESS:
        sortField = "completionPercentage";
        sortDirection = -1;
        break;

      case ProgramSortBy.LATEST:
      default:
        sortField = "createdAt";
        sortDirection = -1;
        break;
    }

    const pipeline: PipelineStage[] = [
      {
        $match: {
          nutritionistId: nutritionistObjectId,
          isDeleted: false,
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
        $lookup: {
          from: "userplans",
          localField: "userPlanId",
          foreignField: "_id",
          as: "userPlan",
        },
      },
      {
        $unwind: "$userPlan",
      },

      {
        $lookup: {
          from: "userprogramprogresses",
          localField: "_id",
          foreignField: "userProgramId",
          as: "progress",
        },
      },
      {
        $unwind: {
          path: "$progress",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $addFields: {
          completionPercentage: {
            $ifNull: ["$progress.completionPercentage", 0],
          },
          adherenceScore: {
            $ifNull: ["$progress.adherenceScore", 0],
          },
          currentStreak: {
            $ifNull: ["$progress.currentStreak", 0],
          },
          currentDay: {
            $ifNull: ["$progress.currentDay", 1],
          },
          lastActivityAt: "$progress.lastActivityAt",
        },
      },
    ];

    if (search?.trim()) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      pipeline.push({
        $match: {
          $or: [
            {
              "user.fullName": {
                $regex: escaped,
                $options: "i",
              },
            },
            {
              "user.username": {
                $regex: escaped,
                $options: "i",
              },
            },
            {
              "userPlan.planSnapshot.title": {
                $regex: escaped,
                $options: "i",
              },
            },
          ],
        },
      });
    }

    if (programStatus !== "all") {
      pipeline.push({
        $match: {
          status: programStatus,
        },
      });
    }

    if (subscriptionStatus !== "all") {
      pipeline.push({
        $match: {
          "userPlan.subscriptionStatus": subscriptionStatus,
        },
      });
    }

    if (cursorData) {
      let cursorValue: string | number | Date = cursorData.value;

      if (
        sortField === "createdAt" ||
        sortField === "startDate" ||
        sortField === "endDate"
      ) {
        cursorValue = new Date(cursorData.value as string);
      }

      const cursorObjectId = new Types.ObjectId(cursorData.id);

      pipeline.push({
        $match:
          sortDirection === -1
            ? {
                $or: [
                  {
                    [sortField]: {
                      $lt: cursorValue,
                    },
                  },
                  {
                    [sortField]: cursorValue,
                    _id: {
                      $lt: cursorObjectId,
                    },
                  },
                ],
              }
            : {
                $or: [
                  {
                    [sortField]: {
                      $gt: cursorValue,
                    },
                  },
                  {
                    [sortField]: cursorValue,
                    _id: {
                      $gt: cursorObjectId,
                    },
                  },
                ],
              },
      });
    }

    pipeline.push(
      {
        $sort: {
          [sortField]: sortDirection,
          _id: sortDirection,
        },
      },
      {
        $limit: limit + 1,
      },
      {
        $project: {
          _id: 0,

          userProgramId: "$_id",

          userId: "$user._id",
          userFullName: "$user.fullName",
          userProfileImage: "$user.profileImage",

          planId: "$planId",
          planTitle: "$userPlan.planSnapshot.title",
          specialization: "$userPlan.planSnapshot.specialization",

          subscriptionStatus: "$userPlan.subscriptionStatus",
          programStatus: "$status",

          startDate: 1,
          endDate: 1,
          durationDays: 1,

          currentDay: 1,

          completionPercentage: 1,
          adherenceScore: 1,
          currentStreak: 1,
          lastActivityAt: 1,

          cursorId: "$_id",
          cursorValue: `$${sortField}`,
        },
      },
    );

    const result =
      await UserProgramModel.aggregate<ProgramProjectionWithCursor>(
        pipeline,
      ).exec();

    const hasMore = result.length > limit;
    const items = hasMore ? result.slice(0, limit) : result;

    let nextCursor: string | null = null;

    if (hasMore && items.length > 0) {
      const lastItem = items[items.length - 1];
      nextCursor = encodeCursor({
        value:
          lastItem.cursorValue instanceof Date
            ? lastItem.cursorValue.toISOString()
            : lastItem.cursorValue,
        id: lastItem.cursorId.toString(),
      });
    }

    return {
      items: items.map(
        ({ cursorId: _cursorId, cursorValue: _cursorValue, ...item }) => item,
      ),
      nextCursor,
      hasMore,
    };
  }

  async findProgramById(
    programId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<IUserProgramDetailsProjection | null> {
    const programObjectId =
      typeof programId === "string" ? new Types.ObjectId(programId) : programId;

    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const result =
      await UserProgramModel.aggregate<IUserProgramDetailsProjection>([
        {
          $match: {
            _id: programObjectId,
            nutritionistId: nutritionistObjectId,
            isDeleted: false,
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
          $lookup: {
            from: "userplans",
            localField: "userPlanId",
            foreignField: "_id",
            as: "userPlan",
          },
        },
        {
          $unwind: "$userPlan",
        },

        {
          $lookup: {
            from: "userprogramprogresses",
            localField: "_id",
            foreignField: "userProgramId",
            as: "progress",
          },
        },
        {
          $unwind: {
            path: "$progress",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            _id: 0,

            userProgramId: "$_id",

            userId: "$user._id",
            userFullName: "$user.fullName",
            userProfileImage: "$user.profileImage",

            planId: "$planId",
            planTitle: "$userPlan.planSnapshot.title",
            planDescription: "$userPlan.planSnapshot.description",
            specialization: "$userPlan.planSnapshot.specialization",

            subscriptionStatus: "$userPlan.subscriptionStatus",
            paymentStatus: "$userPlan.paymentStatus",

            programStatus: "$status",

            startDate: 1,
            endDate: 1,
            durationDays: 1,

            completionPercentage: {
              $ifNull: ["$progress.completionPercentage", 0],
            },

            adherenceScore: {
              $ifNull: ["$progress.adherenceScore", 0],
            },

            currentDay: {
              $ifNull: ["$progress.currentDay", 1],
            },

            completedDays: {
              $ifNull: ["$progress.completedDays", 0],
            },

            totalDays: {
              $ifNull: ["$progress.totalDays", "$durationDays"],
            },

            completedActivities: {
              $ifNull: ["$progress.completedActivities", 0],
            },

            totalActivities: {
              $ifNull: ["$progress.totalActivities", 0],
            },

            skippedActivities: {
              $ifNull: ["$progress.skippedActivities", 0],
            },

            currentStreak: {
              $ifNull: ["$progress.currentStreak", 0],
            },

            longestStreak: {
              $ifNull: ["$progress.longestStreak", 0],
            },

            lastCompletedDay: {
              $ifNull: ["$progress.lastCompletedDay", 0],
            },

            lastActivityAt: "$progress.lastActivityAt",

            programNotes: "$notes",
          },
        },
      ]);

    return result[0] ?? null;
  }

  async existsById(
    programId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<boolean> {
    const exists = await UserProgramModel.exists({
      _id: programId,
      nutritionistId,
      isDeleted: false,
    });

    return exists !== null;
  }
}
