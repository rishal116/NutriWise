import { injectable } from "inversify";
import { ClientSession, FilterQuery, Types, UpdateResult } from "mongoose";
import { BaseRepository } from "../../common/base.repository";
import { IUserProgramRepository } from "../../../interfaces/user/program/IUserProgramRepository";
import {
  IUserProgram,
  UserProgramModel,
} from "../../../../models/userProgram.model";
import { IUserProgramPopulated } from "../../../../types/userProgram.populated";
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
export class UserProgramRepository
  extends BaseRepository<IUserProgram>
  implements IUserProgramRepository
{
  constructor() {
    super(UserProgramModel);
  }


  async findActiveByUserAndNutritionist(
    userId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<IUserProgram | null> {
    return this._model
      .findOne({
        userId,
        nutritionistId,
        status: "active",
        endDate: { $gt: new Date() },
        isDeleted: false,
      })
      .lean<IUserProgram | null>()
      .exec();
  }

  async findLatestProgram(
    userId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<IUserProgram | null> {
    return this._model
      .findOne({
        userId,
        nutritionistId,
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .lean<IUserProgram | null>()
      .exec();
  }

  async findByUserId(
    userId: string | Types.ObjectId,
  ): Promise<IUserProgramPopulated[]> {
    return this._model
      .find({
        userId,
        isDeleted: false,
      })
      .populate("userId")
      .populate("nutritionistId")
      .populate("userPlanId")
      .populate("planId")
      .sort({ createdAt: -1 })
      .lean<IUserProgramPopulated[]>()
      .exec();
  }

  async findByNutritionistId(
    nutritionistId: string | Types.ObjectId,
  ): Promise<IUserProgramPopulated[]> {
    return this._model
      .find({
        nutritionistId,
        isDeleted: false,
      })
      .populate("userId")
      .populate("nutritionistId")
      .populate("userPlanId")
      .populate("planId")
      .sort({ createdAt: -1 })
      .lean<IUserProgramPopulated[]>()
      .exec();
  }

  async findOnePopulated(
    filter: FilterQuery<IUserProgram>,
  ): Promise<IUserProgramPopulated | null> {
    return this._model
      .findOne({
        ...filter,
        isDeleted: false,
      })
      .populate("userId")
      .populate("nutritionistId")
      .populate("userPlanId")
      .populate("planId")
      .lean<IUserProgramPopulated | null>()
      .exec();
  }

  async findByUserAndPlan(
    userId: string | Types.ObjectId,
    planId: string | Types.ObjectId,
  ): Promise<IUserProgram[]> {
    return this._model
      .find({
        userId,
        planId,
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .lean<IUserProgram[]>()
      .exec();
  }

  async findByIdAndUser(
    userId: string | Types.ObjectId,
    programId: string | Types.ObjectId,
  ): Promise<IUserProgram | null> {
    return this._model
      .findOne({
        _id: programId,
        userId,
        isDeleted: false,
      })
      .lean<IUserProgram | null>()
      .exec();
  }

  async updateProgress(
    programId: string | Types.ObjectId,
    currentDay: number,
    completionPercentage: number,
    session?: ClientSession,
  ): Promise<IUserProgram | null> {
    return this._model
      .findByIdAndUpdate(
        programId,
        {
          currentDay,
          completionPercentage,
        },
        {
          new: true,
          session,
        },
      )
      .lean<IUserProgram | null>()
      .exec();
  }

  async activateUpcomingPrograms(): Promise<UpdateResult> {
    return this._model.updateMany(
      {
        status: "upcoming",
        startDate: { $lte: new Date() },
        isDeleted: false,
      },
      {
        $set: {
          status: "active",
        },
      },
    );
  }

  async completeActivePrograms(): Promise<UpdateResult> {
    return this._model.updateMany(
      {
        status: "active",
        endDate: { $lt: new Date() },
        isDeleted: false,
      },
      {
        $set: {
          status: "completed",
          completedAt: new Date(),
        },
      },
    );
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
          _id: 0,

          id: {
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
