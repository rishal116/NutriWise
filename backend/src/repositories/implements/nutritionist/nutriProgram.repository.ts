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
import {
  IProgramProjection,
  ProgramBrowseResult,
} from "../../../types/userProgram.projection";
import { decodeCursor, encodeCursor } from "../../../utils/cursor.util";

interface ProgramProjectionWithCursor extends IProgramProjection {
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
  ): Promise<ProgramBrowseResult> {
    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const { cursor, search, status, sortBy = ProgramSortBy.LATEST } = query;

    const limit = query.limit ?? 10;
    const cursorData = decodeCursor(cursor);

    let sortField:
      | "createdAt"
      | "startDate"
      | "endDate"
      | "completionPercentage" = "createdAt";

    switch (sortBy) {
      case ProgramSortBy.START_DATE:
        sortField = "startDate";
        break;

      case ProgramSortBy.END_DATE:
        sortField = "endDate";
        break;

      case ProgramSortBy.PROGRESS:
        sortField = "completionPercentage";
        break;

      default:
        sortField = "createdAt";
    }

    const sortDirection: 1 | -1 = -1;

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
          from: "nutritionistplans",
          localField: "planId",
          foreignField: "_id",
          as: "plan",
        },
      },
      {
        $unwind: "$plan",
      },
    ];

    if (search?.trim()) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
          ],
        },
      });
    }

    if (status && status !== "all") {
      pipeline.push({
        $match: {
          status,
        },
      });
    }

    if (cursorData) {
      const cursorObjectId = new Types.ObjectId(cursorData.id);

      pipeline.push({
        $match:
          sortDirection === -1
            ? {
                $or: [
                  {
                    [sortField]: {
                      $lt: cursorData.value,
                    },
                  },
                  {
                    [sortField]: cursorData.value,
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
                      $gt: cursorData.value,
                    },
                  },
                  {
                    [sortField]: cursorData.value,
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
          userPlanId: "$userPlanId",
          planId: "$plan._id",

          fullName: "$user.fullName",
          username: "$user.username",
          profileImage: "$user.profileImage",

          planTitle: "$plan.title",

          status: "$status",
          currentDay: "$currentDay",
          durationDays: "$durationDays",
          completionPercentage: "$completionPercentage",

          startDate: "$startDate",
          endDate: "$endDate",

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

    const nextCursor =
      hasMore && items.length > 0
        ? encodeCursor({
            value: items[items.length - 1].cursorValue,
            id: items[items.length - 1].cursorId.toString(),
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
  ): Promise<IProgramProjection | null> {
    const programObjectId =
      typeof programId === "string" ? new Types.ObjectId(programId) : programId;

    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const result = await UserProgramModel.aggregate<IProgramProjection>([
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
          from: "nutritionistplans",
          localField: "planId",
          foreignField: "_id",
          as: "plan",
        },
      },

      {
        $unwind: "$plan",
      },

      {
        $project: {
          _id: 0,

          userProgramId: "$_id",

          userId: "$user._id",

          userPlanId: "$userPlanId",

          planId: "$plan._id",

          fullName: "$user.fullName",

          username: "$user.username",

          profileImage: "$user.profileImage",

          planTitle: "$plan.title",

          status: "$status",

          currentDay: "$currentDay",

          durationDays: "$durationDays",

          completionPercentage: "$completionPercentage",

          startDate: "$startDate",

          endDate: "$endDate",
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
