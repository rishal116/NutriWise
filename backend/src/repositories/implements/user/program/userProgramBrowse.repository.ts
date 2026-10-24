import { injectable } from "inversify";
import { Types } from "mongoose";
import type { PipelineStage } from "mongoose";

import { BaseRepository } from "../../common/base.repository";
import type { IUserProgramBrowseRepository } from "../../../interfaces/user/program/IUserProgramBrowseRepository";

import { UserProgramModel } from "../../../../models/userProgram.model";
import type { IUserProgram } from "../../../../models/userProgram.model";

import { UserProgramSort } from "../../../../dtos/user/program/user-Program-list-query.dto";
import type { UserProgramListQueryDTO } from "../../../../dtos/user/program/user-Program-list-query.dto";

import type { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";
import type { IUserProgramDetailsProjection } from "../../../../types/user/program/user-program-details.projection";
import type { IUserProgramCardProjection } from "../../../../types/user/program/user-program-card.projection";

import { encodeCursor, decodeCursor } from "../../../../utils/cursor.util";

export const USER_PROGRAM_SORT_FIELD_MAP: Record<
  UserProgramSort,
  { field: string; order: 1 | -1 }
> = {
  [UserProgramSort.NEWEST]: {
    field: "userPlan.createdAt",
    order: -1,
  },
  [UserProgramSort.OLDEST]: {
    field: "userPlan.createdAt",
    order: 1,
  },
  [UserProgramSort.START_DATE]: {
    field: "startDate",
    order: -1,
  },
  [UserProgramSort.END_DATE]: {
    field: "endDate",
    order: 1,
  },
};

interface IProgramCardWithCursor extends IUserProgramCardProjection {
  cursorId: Types.ObjectId;
  cursorValue: Date;
}

@injectable()
export class UserProgramBrowseRepository
  extends BaseRepository<IUserProgram>
  implements IUserProgramBrowseRepository
{
  constructor() {
    super(UserProgramModel);
  }

  async browsePrograms(
    userId: string | Types.ObjectId,
    query: UserProgramListQueryDTO,
  ): Promise<CursorPaginationResult<IUserProgramCardProjection>> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const {
      limit = 12,
      search,
      programStatus,
      sort = UserProgramSort.NEWEST,
      cursor,
    } = query;

    const userObjectId =
      typeof userId === "string" ? new Types.ObjectId(userId) : userId;

    const { field, order } = USER_PROGRAM_SORT_FIELD_MAP[sort];

    const searchText = search?.trim();
    const cursorData = decodeCursor(cursor);

    if (cursorData?.sortKey && cursorData.sortKey !== sort) {
      throw new Error("Invalid cursor for the selected sort order");
    }

    const pipeline: PipelineStage[] = [
      {
        $match: {
          userId: userObjectId,
          ...(programStatus ? { status: programStatus } : {}),
        },
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
        $lookup: {
          from: "users",
          localField: "nutritionistId",
          foreignField: "_id",
          as: "nutritionist",
        },
      },
      {
        $unwind: "$nutritionist",
      },
    ];

    if (searchText) {
      const escapedSearchText = searchText.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );

      pipeline.push({
        $match: {
          $or: [
            {
              "userPlan.planSnapshot.title": {
                $regex: escapedSearchText,
                $options: "i",
              },
            },
            {
              "nutritionist.fullName": {
                $regex: escapedSearchText,
                $options: "i",
              },
            },
          ],
        },
      });
    }

    if (cursorData) {
      if (!Types.ObjectId.isValid(cursorData.id)) {
        throw new Error("Invalid cursor ID");
      }

      const cursorValue = new Date(cursorData.value);

      if (Number.isNaN(cursorValue.getTime())) {
        throw new Error("Invalid cursor value");
      }

      const cursorId = new Types.ObjectId(cursorData.id);

      pipeline.push({
        $match: {
          $or: [
            {
              [field]:
                order === -1 ? { $lt: cursorValue } : { $gt: cursorValue },
            },
            {
              [field]: cursorValue,
              _id: order === -1 ? { $lt: cursorId } : { $gt: cursorId },
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
          _id: {
            $toString: "$_id",
          },
          title: "$userPlan.planSnapshot.title",
          nutritionist: {
            _id: {
              $toString: "$nutritionist._id",
            },
            fullName: "$nutritionist.fullName",
            profileImage: {
              $ifNull: ["$nutritionist.profileImage", "$$REMOVE"],
            },
          },
          programStatus: "$status",
          currentDay: {
            $ifNull: ["$progress.currentDay", 1],
          },
          durationDays: "$durationDays",
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
                            $ifNull: ["$progress.completedActivities", 0],
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
          startDate: "$startDate",
          endDate: "$endDate",
          cursorId: "$_id",
          cursorValue: `$${field}`,
        },
      },
    );

    const result =
      await this._model.aggregate<IProgramCardWithCursor>(pipeline);

    const hasMore = result.length > limit;
    const items = hasMore ? result.slice(0, limit) : result;
    const lastItem = items[items.length - 1];

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            id: lastItem.cursorId.toString(),
            value: lastItem.cursorValue.toISOString(),
            sortKey: sort,
          })
        : null;

    const cleanItems: IUserProgramCardProjection[] = items.map(
      ({ cursorId: _cursorId, cursorValue: _cursorValue, ...item }) => item,
    );

    return {
      items: cleanItems,
      nextCursor,
      hasMore,
    };
  }

  async findProgramDetails(
    userId: string | Types.ObjectId,
    programId: string | Types.ObjectId,
  ): Promise<IUserProgramDetailsProjection | null> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(programId)) {
      throw new Error("Invalid user ID or program ID");
    }

    const userObjectId =
      typeof userId === "string" ? new Types.ObjectId(userId) : userId;

    const programObjectId =
      typeof programId === "string" ? new Types.ObjectId(programId) : programId;

    const pipeline: PipelineStage[] = [
      {
        $match: {
          _id: programObjectId,
          userId: userObjectId,
        },
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
        $lookup: {
          from: "users",
          localField: "nutritionistId",
          foreignField: "_id",
          as: "nutritionist",
        },
      },
      {
        $unwind: "$nutritionist",
      },
      {
        $project: {
          _id: 1,
          title: "$userPlan.planSnapshot.title",
          userPlanId: 1,
          nutritionist: {
            _id: "$nutritionist._id",
            fullName: "$nutritionist.fullName",
            username: "$nutritionist.username",
            profileImage: {
              $ifNull: ["$nutritionist.profileImage", "$$REMOVE"],
            },
          },
          status: 1,
          currentDay: {
            $ifNull: ["$progress.currentDay", 1],
          },
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
                            $ifNull: ["$progress.completedActivities", 0],
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
          startDate: 1,
          endDate: 1,
        },
      },
    ];

    const [program] =
      await this._model.aggregate<IUserProgramDetailsProjection>(pipeline);

    return program ?? null;
  }
}
