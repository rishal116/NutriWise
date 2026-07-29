import { injectable } from "inversify";
import { ClientSession, FilterQuery, Types, UpdateResult } from "mongoose";
import { BaseRepository } from "../common/base.repository";
import { IUserProgramRepository } from "../../interfaces/user/IUserProgramRepository";
import {
  IUserProgram,
  UserProgramModel,
} from "../../../models/userProgram.model";
import { IUserProgramPopulated } from "../../../types/userProgram.populated";
import { UserProgramListQueryDTO } from "../../../dtos/user/program/user-Program-list-query.dto";
import {
  IUserProgramCardProjection,
  UserProgramBrowseResult,
} from "../../../types/userProgram.card";
import { IUserProgramDetailsProjection } from "../../../types/user/program/user-program-details.projection";
import { PipelineStage } from "mongoose";
import { encodeCursor, decodeCursor } from "../../../utils/cursor.util";
import { UserProgramSort } from "../../../dtos/user/program/user-Program-list-query.dto";

interface ProgramCardWithCursor extends IUserProgramCardProjection {
  cursorId: Types.ObjectId;
  cursorValue: string | number | Date;
}

@injectable()
export class UserProgramRepository
  extends BaseRepository<IUserProgram>
  implements IUserProgramRepository
{
  constructor() {
    super(UserProgramModel);
  }

  async createWithSession(
    data: Partial<IUserProgram>,
    session: ClientSession,
  ): Promise<IUserProgram> {
    const [doc] = await this._model.create([data], { session });
    return doc;
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
  ): Promise<UserProgramBrowseResult> {
    const {
      limit,
      search,
      status,
      sort = UserProgramSort.NEWEST,
      cursor,
    } = query;

    const decodedCursor = decodeCursor(cursor);

    const sortMap: Record<UserProgramSort, { field: string; order: 1 | -1 }> = {
      [UserProgramSort.NEWEST]: {
        field: "createdAt",
        order: -1,
      },
      [UserProgramSort.OLDEST]: {
        field: "createdAt",
        order: 1,
      },
      [UserProgramSort.START_DATE]: {
        field: "startDate",
        order: -1,
      },
      [UserProgramSort.END_DATE]: {
        field: "endDate",
        order: -1,
      },
      [UserProgramSort.PROGRESS]: {
        field: "completionPercentage",
        order: -1,
      },
    };

    const { field, order } = sortMap[sort];

    const pipeline: PipelineStage[] = [];

    pipeline.push({
      $match: {
        userId: new Types.ObjectId(userId),
        isDeleted: false,
        ...(status && { status }),
      },
    });

    pipeline.push(
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
    );

    if (search?.trim()) {
      pipeline.push({
        $match: {
          $or: [
            {
              "userPlan.planSnapshot.title": {
                $regex: search,
                $options: "i",
              },
            },
            {
              "nutritionist.fullName": {
                $regex: search,
                $options: "i",
              },
            },
          ],
        },
      });
    }

    if (decodedCursor) {
      pipeline.push({
        $match: {
          $or: [
            {
              [field]:
                order === -1
                  ? { $lt: decodedCursor.value }
                  : { $gt: decodedCursor.value },
            },
            {
              [field]: decodedCursor.value,
              _id:
                order === -1
                  ? { $lt: new Types.ObjectId(decodedCursor.id) }
                  : { $gt: new Types.ObjectId(decodedCursor.id) },
            },
          ],
        },
      });
    }

    pipeline.push({
      $sort: {
        [field]: order,
        _id: order,
      },
    });

    pipeline.push({
      $limit: limit + 1,
    });

    pipeline.push({
      $project: {
        _id: 1,
        title: "$userPlan.planSnapshot.title",

        nutritionist: {
          _id: "$nutritionist._id",
          fullName: "$nutritionist.fullName",
          profileImage: "$nutritionist.profileImage",
        },

        status: 1,
        currentDay: 1,
        durationDays: 1,
        completionPercentage: 1,
        startDate: 1,
        endDate: 1,

        cursorId: "$_id",
        cursorValue: `$${field}`,
      },
    });

    const programs =
      await this._model.aggregate<ProgramCardWithCursor>(pipeline);

    const hasMore = programs.length > limit;

    const items = hasMore ? programs.slice(0, limit) : programs;

    const nextCursor =
      hasMore && items.length
        ? encodeCursor({
            id: items[items.length - 1].cursorId.toString(),
            value: items[items.length - 1].cursorValue,
          })
        : null;

    return {
      items: items.map(
        ({ cursorId: _cursorId, cursorValue: _cursorValue, ...program }) =>
          program,
      ),
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
