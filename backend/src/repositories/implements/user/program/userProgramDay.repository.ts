import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";
import { BaseRepository } from "../../common/base.repository";
import {
  IUserProgramDay,
  UserProgramDayModel,
} from "../../../../models/userProgramDay.model";
import { IUserProgramDayRepository } from "../../../interfaces/user/program/IUserProgramDayRepository";
import {
  IUserProgramDayDetailsProjection,
  IUserProgramDayListProjection,
} from "../../../../types/user/program/user-program-day.projection";
import { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";
import { decodeCursor, encodeCursor } from "../../../../utils/cursor.util";
import {
  UserProgramDayListQueryDTO,
  UserProgramDaySort,
} from "../../../../dtos/user/program/user-program-day-list-query.dto";

export const USER_PROGRAM_DAY_SORT_FIELD_MAP: Record<
  UserProgramDaySort,
  {
    field: string;
    order: 1 | -1;
  }
> = {
  [UserProgramDaySort.DAY_ASC]: {
    field: "dayNumber",
    order: 1,
  },

  [UserProgramDaySort.DAY_DESC]: {
    field: "dayNumber",
    order: -1,
  },

  [UserProgramDaySort.NEWEST]: {
    field: "createdAt",
    order: -1,
  },

  [UserProgramDaySort.OLDEST]: {
    field: "createdAt",
    order: 1,
  },
};

interface ProgramDayCardWithCursor extends IUserProgramDayListProjection {
  cursorId: Types.ObjectId;
  cursorValue: number | Date;
}

@injectable()
export class UserProgramDayRepository
  extends BaseRepository<IUserProgramDay>
  implements IUserProgramDayRepository
{
  constructor() {
    super(UserProgramDayModel);
  }

  async browseProgramDays(
    userId: string | Types.ObjectId,
    programId: string | Types.ObjectId,
    query: UserProgramDayListQueryDTO,
  ): Promise<CursorPaginationResult<IUserProgramDayListProjection>> {
    const {
      limit = 12,
      search,
      status,
      locked,
      sort = UserProgramDaySort.DAY_ASC,
      cursor,
    } = query;
    const userObjectId =
      typeof userId === "string" ? new Types.ObjectId(userId) : userId;
    const programObjectId =
      typeof programId === "string" ? new Types.ObjectId(programId) : programId;
    const searchText = search?.trim();
    const cursorData = decodeCursor(cursor);
    const { field, order } = USER_PROGRAM_DAY_SORT_FIELD_MAP[sort];
    if (cursorData?.sortKey && cursorData.sortKey !== sort) {
      throw new Error("Invalid cursor");
    }
    const pipeline: PipelineStage[] = [
      {
        $match: {
          userProgramId: programObjectId,
        },
      },
      {
        $lookup: {
          from: "userprograms",
          localField: "userProgramId",
          foreignField: "_id",
          as: "program",
        },
      },
      {
        $unwind: "$program",
      },
      {
        $match: {
          "program.userId": userObjectId,
          "program.isDeleted": false,
        },
      },
      {
        $lookup: {
          from: "userdaytrackings",
          let: {
            programDayId: "$_id",
            programId: "$userProgramId",
            userId: userObjectId,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$userProgramDayId", "$$programDayId"],
                    },
                    {
                      $eq: ["$userProgramId", "$$programId"],
                    },
                    {
                      $eq: ["$userId", "$$userId"],
                    },
                  ],
                },
              },
            },
          ],
          as: "tracking",
        },
      },

      {
        $unwind: {
          path: "$tracking",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    if (searchText) {
      const searchNumber = Number(searchText);

      const searchConditions: Record<string, unknown>[] = [
        {
          "activities.title": {
            $regex: searchText,
            $options: "i",
          },
        },
      ];

      if (!Number.isNaN(searchNumber)) {
        searchConditions.push({
          dayNumber: searchNumber,
        });
      }

      pipeline.push({
        $match: {
          $or: searchConditions,
        },
      });
    }

    if (status) {
      pipeline.push({
        $match: {
          "tracking.status": status,
        },
      });
    }

    if (locked !== undefined) {
      pipeline.push({
        $match: {
          "tracking.isLocked": locked,
        },
      });
    }

    if (cursorData) {
      let cursorValue: string | number | Date = cursorData.value;

      if (field === "createdAt" || field === "updatedAt") {
        cursorValue = new Date(cursorData.value);
      }

      pipeline.push({
        $match: {
          $or: [
            {
              [field]:
                order === -1 ? { $lt: cursorValue } : { $gt: cursorValue },
            },
            {
              [field]: cursorValue,
              _id:
                order === -1
                  ? {
                      $lt: new Types.ObjectId(cursorData.id),
                    }
                  : {
                      $gt: new Types.ObjectId(cursorData.id),
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
          _id: 1,

          userProgramId: 1,

          dayNumber: 1,

          totalActivities: {
            $size: "$activities",
          },

          requiredActivities: {
            $size: {
              $filter: {
                input: "$activities",
                as: "activity",
                cond: {
                  $eq: ["$$activity.isRequired", true],
                },
              },
            },
          },

          tracking: {
            $cond: [
              {
                $ne: [
                  {
                    $type: "$tracking",
                  },
                  "missing",
                ],
              },
              {
                status: "$tracking.status",

                completedActivities: "$tracking.completedActivities",

                skippedActivities: "$tracking.skippedActivities",

                overallCompletionPercentage:
                  "$tracking.overallCompletionPercentage",

                adherenceScore: "$tracking.adherenceScore",

                isLocked: "$tracking.isLocked",
              },
              null,
            ],
          },

          cursorId: "$_id",

          cursorValue: `$${field}`,
        },
      },
    );

    const result =
      await this._model.aggregate<ProgramDayCardWithCursor>(pipeline);

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
            sortKey: sort,
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

  async findProgramDayDetails(
    userId: string | Types.ObjectId,
    programId: string | Types.ObjectId,
    dayNumber: number,
  ): Promise<IUserProgramDayDetailsProjection | null> {
    const userObjectId =
      typeof userId === "string" ? new Types.ObjectId(userId) : userId;

    const programObjectId =
      typeof programId === "string" ? new Types.ObjectId(programId) : programId;

    const pipeline: PipelineStage[] = [
      {
        $match: {
          userProgramId: programObjectId,
          dayNumber,
        },
      },

      {
        $lookup: {
          from: "userprograms",
          localField: "userProgramId",
          foreignField: "_id",
          as: "program",
        },
      },

      {
        $unwind: "$program",
      },

      {
        $match: {
          "program.userId": userObjectId,
          "program.isDeleted": false,
        },
      },

      {
        $lookup: {
          from: "userdaytrackings",
          let: {
            programDayId: "$_id",
            programId: "$userProgramId",
            userId: userObjectId,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$userProgramDayId", "$$programDayId"],
                    },
                    {
                      $eq: ["$userProgramId", "$$programId"],
                    },
                    {
                      $eq: ["$userId", "$$userId"],
                    },
                  ],
                },
              },
            },
            {
              $limit: 1,
            },
          ],
          as: "tracking",
        },
      },

      {
        $unwind: {
          path: "$tracking",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "useractivitytrackings",
          let: {
            programDayId: "$_id",
            programId: "$userProgramId",
            userId: userObjectId,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$userProgramDayId", "$$programDayId"],
                    },
                    {
                      $eq: ["$userProgramId", "$$programId"],
                    },
                    {
                      $eq: ["$userId", "$$userId"],
                    },
                  ],
                },
              },
            },
          ],
          as: "activityTracking",
        },
      },

      {
        $set: {
          activities: {
            $map: {
              input: "$activities",
              as: "activity",
              in: {
                $let: {
                  vars: {
                    tracking: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$activityTracking",
                            as: "trackedActivity",
                            cond: {
                              $eq: [
                                "$$trackedActivity.activityId",
                                "$$activity._id",
                              ],
                            },
                          },
                        },
                        0,
                      ],
                    },
                  },

                  in: {
                    _id: "$$activity._id",

                    category: "$$activity.category",

                    title: "$$activity.title",

                    description: "$$activity.description",

                    instructions: "$$activity.instructions",

                    valueType: "$$activity.valueType",

                    targetValue: "$$activity.targetValue",

                    unit: "$$activity.unit",

                    estimatedDurationMinutes:
                      "$$activity.estimatedDurationMinutes",

                    scheduledTime: "$$activity.scheduledTime",

                    isRequired: "$$activity.isRequired",

                    order: "$$activity.order",

                    tracking: {
                      status: {
                        $ifNull: ["$$tracking.status", "not_started"],
                      },

                      recordedValue: "$$tracking.recordedValue",

                      actualDurationMinutes: "$$tracking.actualDurationMinutes",

                      score: "$$tracking.score",

                      evidence: {
                        $ifNull: ["$$tracking.evidence", []],
                      },

                      skippedReason: "$$tracking.skippedReason",

                      notes: "$$tracking.notes",

                      nutritionistFeedback: "$$tracking.nutritionistFeedback",

                      startedAt: "$$tracking.startedAt",

                      completedAt: "$$tracking.completedAt",
                    },
                  },
                },
              },
            },
          },
        },
      },

      {
        $project: {
          _id: 1,

          dayNumber: 1,

          tracking: {
            _id: "$tracking._id",

            date: "$tracking.date",

            status: {
              $ifNull: ["$tracking.status", "not_started"],
            },

            isLocked: {
              $ifNull: ["$tracking.isLocked", false],
            },

            totalActivities: {
              $ifNull: [
                "$tracking.totalActivities",
                {
                  $size: "$activities",
                },
              ],
            },

            completedActivities: {
              $ifNull: ["$tracking.completedActivities", 0],
            },

            skippedActivities: {
              $ifNull: ["$tracking.skippedActivities", 0],
            },

            overallCompletionPercentage: {
              $ifNull: ["$tracking.overallCompletionPercentage", 0],
            },

            adherenceScore: {
              $ifNull: ["$tracking.adherenceScore", 0],
            },

            startedAt: "$tracking.startedAt",

            completedAt: "$tracking.completedAt",

            lastActivityAt: "$tracking.lastActivityAt",

            userNotes: "$tracking.userNotes",

            nutritionistNotes: "$tracking.nutritionistNotes",
          },

          activities: 1,
        },
      },
    ];

    const [day] =
      await this._model.aggregate<IUserProgramDayDetailsProjection>(pipeline);

    return day ?? null;
  }
}
