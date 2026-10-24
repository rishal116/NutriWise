import { injectable } from "inversify";
import { Types } from "mongoose";
import type { PipelineStage } from "mongoose";

import { BaseRepository } from "../common/base.repository";

import { UserProgramModel } from "../../../models/userProgram.model";
import type { IUserProgram } from "../../../models/userProgram.model";

import {
  GetProgramsQueryDTO,
  ProgramSortBy,
} from "../../../dtos/nutritionist/program/nutri-program-request.dto";

import type { INutriProgramRepository } from "../../interfaces/nutritionist/INutriProgramRepository";

import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

import { decodeCursor, encodeCursor } from "../../../utils/cursor.util";

import type { INutriProgramCardProjection } from "../../../types/nutritionist/program/nutri-program-card.projection";
import type { INutriProgramDetailsProjection } from "../../../types/nutritionist/program/nutri-program-details.projection";

interface IProgramCardWithCursor extends INutriProgramCardProjection {
  cursorId: Types.ObjectId;
  cursorValue: string | number | Date;
}

const PROGRAM_SORT_CONFIG: Record<
  ProgramSortBy,
  { field: string; direction: 1 | -1 }
> = {
  [ProgramSortBy.LATEST]: {
    field: "createdAt",
    direction: -1,
  },
  [ProgramSortBy.OLDEST]: {
    field: "createdAt",
    direction: 1,
  },
  [ProgramSortBy.START_DATE]: {
    field: "startDate",
    direction: -1,
  },
  [ProgramSortBy.END_DATE]: {
    field: "endDate",
    direction: -1,
  },
  [ProgramSortBy.PROGRESS]: {
    field: "completionPercentage",
    direction: -1,
  },
};

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
  ): Promise<CursorPaginationResult<INutriProgramCardProjection>> {
    if (!Types.ObjectId.isValid(nutritionistId)) {
      throw new Error("Invalid nutritionist ID");
    }

    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const {
      cursor,
      limit = 10,
      search,
      programStatus = "all",
      sortBy = ProgramSortBy.LATEST,
    } = query;

    const { field: sortField, direction: sortDirection } =
      PROGRAM_SORT_CONFIG[sortBy];

    const pipeline: PipelineStage[] = [
      {
        $match: {
          nutritionistId: nutritionistObjectId,
          ...(programStatus !== "all" ? { status: programStatus } : {}),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                fullName: 1,
                profileImage: 1,
                username: 1,
              },
            },
          ],
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
          pipeline: [
            {
              $project: {
                "planSnapshot.title": 1,
                "planSnapshot.specialization": 1,
              },
            },
          ],
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
          pipeline: [
            {
              $project: {
                completedActivities: 1,
                totalActivities: 1,
              },
            },
          ],
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
            $cond: [
              {
                $gt: [{ $ifNull: ["$progress.totalActivities", 0] }, 0],
              },
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          {
                            $min: [
                              {
                                $ifNull: ["$progress.completedActivities", 0],
                              },
                              "$progress.totalActivities",
                            ],
                          },
                          "$progress.totalActivities",
                        ],
                      },
                      100,
                    ],
                  },
                  0,
                ],
              },
              0,
            ],
          },
        },
      },
    ];

    const normalizedSearch = search?.trim();

    if (normalizedSearch) {
      const escapedSearch = normalizedSearch.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );

      pipeline.push({
        $match: {
          $or: [
            {
              "user.fullName": {
                $regex: escapedSearch,
                $options: "i",
              },
            },
            {
              "user.username": {
                $regex: escapedSearch,
                $options: "i",
              },
            },
            {
              "userPlan.planSnapshot.title": {
                $regex: escapedSearch,
                $options: "i",
              },
            },
          ],
        },
      });
    }

    const cursorData = decodeCursor(cursor);

    if (cursorData) {
      if (
        cursorData.sortKey !== sortBy ||
        !Types.ObjectId.isValid(cursorData.id)
      ) {
        throw new Error("Invalid cursor for the selected sort order");
      }

      let cursorValue: string | number | Date = cursorData.value;

      if (
        sortField === "createdAt" ||
        sortField === "startDate" ||
        sortField === "endDate"
      ) {
        const dateValue = new Date(cursorData.value);

        if (
          typeof cursorData.value !== "string" ||
          Number.isNaN(dateValue.getTime())
        ) {
          throw new Error("Invalid date cursor");
        }

        cursorValue = dateValue;
      } else if (
        typeof cursorData.value !== "number" ||
        !Number.isFinite(cursorData.value)
      ) {
        throw new Error("Invalid progress cursor");
      }

      const cursorObjectId = new Types.ObjectId(cursorData.id);
      const comparisonOperator = sortDirection === -1 ? "$lt" : "$gt";

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
                [comparisonOperator]: cursorObjectId,
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
          planTitle: "$userPlan.planSnapshot.title",
          specialization: "$userPlan.planSnapshot.specialization",
          programStatus: "$status",
          startDate: 1,
          endDate: 1,
          durationDays: 1,
          completionPercentage: 1,
          cursorId: "$_id",
          cursorValue: `$${sortField}`,
        },
      },
    );

    const results = await this._model
      .aggregate<IProgramCardWithCursor>(pipeline)
      .exec();

    const hasMore = results.length > limit;
    const items = results.slice(0, limit);
    const lastItem = items.at(-1);

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            value:
              lastItem.cursorValue instanceof Date
                ? lastItem.cursorValue.toISOString()
                : lastItem.cursorValue,
            id: lastItem.cursorId.toHexString(),
            sortKey: sortBy,
          })
        : null;

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
  ): Promise<INutriProgramDetailsProjection | null> {
    if (
      !Types.ObjectId.isValid(programId) ||
      !Types.ObjectId.isValid(nutritionistId)
    ) {
      throw new Error("Invalid program ID or nutritionist ID");
    }

    const programObjectId =
      typeof programId === "string" ? new Types.ObjectId(programId) : programId;

    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const pipeline: PipelineStage[] = [
      {
        $match: {
          _id: programObjectId,
          nutritionistId: nutritionistObjectId,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                fullName: 1,
                profileImage: 1,
              },
            },
          ],
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
          pipeline: [
            {
              $project: {
                "planSnapshot.title": 1,
                "planSnapshot.description": 1,
                "planSnapshot.specialization": 1,
              },
            },
          ],
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
          pipeline: [
            {
              $project: {
                completedDays: 1,
                totalDays: 1,
                completedActivities: 1,
                totalActivities: 1,
                skippedActivities: 1,
                currentStreak: 1,
                longestStreak: 1,
                lastActivityAt: 1,
              },
            },
          ],
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
          planTitle: "$userPlan.planSnapshot.title",
          planDescription: "$userPlan.planSnapshot.description",
          specialization: "$userPlan.planSnapshot.specialization",
          programStatus: "$status",
          startDate: 1,
          endDate: 1,
          durationDays: 1,
          completionPercentage: {
            $cond: [
              {
                $gt: [{ $ifNull: ["$progress.totalActivities", 0] }, 0],
              },
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          {
                            $min: [
                              {
                                $ifNull: ["$progress.completedActivities", 0],
                              },
                              "$progress.totalActivities",
                            ],
                          },
                          "$progress.totalActivities",
                        ],
                      },
                      100,
                    ],
                  },
                  0,
                ],
              },
              0,
            ],
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
          lastActivityAt: {
            $ifNull: ["$progress.lastActivityAt", null],
          },
        },
      },
    ];

    const [program] = await this._model
      .aggregate<INutriProgramDetailsProjection>(pipeline)
      .exec();

    return program ?? null;
  }

  async existsById(
    programId: string,
    nutritionistId: string,
  ): Promise<boolean> {
    if (
      !Types.ObjectId.isValid(programId) ||
      !Types.ObjectId.isValid(nutritionistId)
    ) {
      return false;
    }

    return Boolean(
      await this._model.exists({
        _id: new Types.ObjectId(programId),
        nutritionistId: new Types.ObjectId(nutritionistId),
      }),
    );
  }
}
