import { injectable } from "inversify";
import { Types } from "mongoose";
import { BaseRepository } from "../../common/base.repository";
import { IUserProgramBrowseRepository } from "../../../interfaces/user/program/IUserProgramBrowseRepository";
import {
  IUserProgram,
  UserProgramModel,
} from "../../../../models/userProgram.model";
import { UserProgramListQueryDTO } from "../../../../dtos/user/program/user-Program-list-query.dto";
import { UserProgramCardResponseDTO } from "../../../../dtos/user/program/user-program-card-response.dto";
import { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";
import { IUserProgramDetailsProjection } from "../../../../types/user/program/user-program-details.projection";
import { PipelineStage } from "mongoose";
import { encodeCursor, decodeCursor } from "../../../../utils/cursor.util";
import { UserProgramSort } from "../../../../dtos/user/program/user-Program-list-query.dto";

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

interface ProgramCardWithCursor extends UserProgramCardResponseDTO {
  cursorId: Types.ObjectId;
  cursorValue: number | Date;
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
  ): Promise<CursorPaginationResult<UserProgramCardResponseDTO>> {
    const {
      limit = 12,
      search,
      programStatus,
      subscriptionStatus,
      sort = UserProgramSort.NEWEST,
      cursor,
    } = query;
    const searchText = search?.trim();
    const cursorData = decodeCursor(cursor);

    const { field, order } = USER_PROGRAM_SORT_FIELD_MAP[sort];
    if (cursorData?.sortKey && cursorData.sortKey !== sort) {
      throw new Error("Invalid cursor");
    }

    const pipeline: PipelineStage[] = [
      {
        $match: {
          userId: new Types.ObjectId(userId),
          isDeleted: false,
          ...(programStatus && { status: programStatus }),
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
    ];

    if (subscriptionStatus) {
      pipeline.push({
        $match: {
          "userPlan.subscriptionStatus": subscriptionStatus,
        },
      });
    }

    pipeline.push(
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
    );

    if (searchText) {
      pipeline.push({
        $match: {
          $or: [
            {
              "userPlan.planSnapshot.title": {
                $regex: searchText,
                $options: "i",
              },
            },
            {
              "nutritionist.fullName": {
                $regex: searchText,
                $options: "i",
              },
            },
          ],
        },
      });
    }

    if (cursorData) {
      let cursorValue: string | number | Date = cursorData.value;

      if (
        field === "userPlan.createdAt" ||
        field === "startDate" ||
        field === "endDate"
      ) {
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
                  ? { $lt: new Types.ObjectId(cursorData.id) }
                  : { $gt: new Types.ObjectId(cursorData.id) },
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
            profileImage: "$nutritionist.profileImage",
          },
          subscriptionStatus: "$userPlan.subscriptionStatus",
          programStatus: "$status",
          currentDay: 1,
          durationDays: 1,
          completionPercentage: 1,
          startDate: 1,
          endDate: 1,
          cursorId: "$_id",
          cursorValue: `$${field}`,
        },
      },
    );

    const result = await this._model.aggregate<ProgramCardWithCursor>(pipeline);
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

  async findProgramDetails(
    userId: string | Types.ObjectId,
    programId: string | Types.ObjectId,
  ): Promise<IUserProgramDetailsProjection | null> {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          _id: new Types.ObjectId(programId),
          userId: new Types.ObjectId(userId),
          isDeleted: false,
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

          nutritionist: {
            _id: "$nutritionist._id",
            fullName: "$nutritionist.fullName",
            username: "$nutritionist.username",
            profileImage: "$nutritionist.profileImage",
          },

          status: 1,
          currentDay: 1,
          durationDays: 1,
          completionPercentage: 1,

          startDate: 1,
          endDate: 1,

          paymentStatus: "$userPlan.paymentStatus",
          subscriptionStatus: "$userPlan.subscriptionStatus",

          purchasedAt: "$userPlan.createdAt",
        },
      },
    ];

    const [program] =
      await this._model.aggregate<IUserProgramDetailsProjection>(pipeline);

    return program ?? null;
  }
}
