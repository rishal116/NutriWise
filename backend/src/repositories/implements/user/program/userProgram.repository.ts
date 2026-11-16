import { injectable } from "inversify";
import type { ClientSession, FilterQuery, Types, UpdateResult } from "mongoose";

import { BaseRepository } from "../../common/base.repository";
import {
  IUserProgram,
  UserProgramModel,
} from "../../../../models/userProgram.model";
import type { IUserProgramRepository } from "../../../interfaces/user/program/IUserProgramRepository";
import type { IUserProgramPopulated } from "../../../../types/userProgram.populated";
import { BLOCKING_PURCHASE_STATUSES } from "../../../../constants/user/program/program-status.constants";

@injectable()
export class UserProgramRepository
  extends BaseRepository<IUserProgram>
  implements IUserProgramRepository
{
  constructor() {
    super(UserProgramModel);
  }

  private findPopulatedPrograms(filter: FilterQuery<IUserProgram>) {
    return this._model
      .find(filter)
      .populate("userId")
      .populate("nutritionistId")
      .populate("userPlanId")
      .populate("planId");
  }

  async findActiveByUserAndNutritionist(
    userId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<IUserProgram | null> {
    return this.findOne(
      {
        userId,
        nutritionistId,
        status: "active",
        endDate: { $gt: new Date() },
      },
      session,
    );
  }

  async findLatestProgram(
    userId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<IUserProgram | null> {
    return this._model
      .findOne({
        userId,
        nutritionistId,
        status: { $in: ["upcoming", "active", "paused"] },
      })
      .sort({ endDate: -1, createdAt: -1 })
      .lean<IUserProgram | null>()
      .exec();
  }

  async findByUserId(
    userId: string | Types.ObjectId,
  ): Promise<IUserProgramPopulated[]> {
    return this.findPopulatedPrograms({ userId })
      .sort({ createdAt: -1 })
      .lean<IUserProgramPopulated[]>()
      .exec();
  }

  async findByNutritionistId(
    nutritionistId: string | Types.ObjectId,
  ): Promise<IUserProgramPopulated[]> {
    return this.findPopulatedPrograms({ nutritionistId })
      .sort({ createdAt: -1 })
      .lean<IUserProgramPopulated[]>()
      .exec();
  }

  async findOnePopulated(
    filter: FilterQuery<IUserProgram>,
  ): Promise<IUserProgramPopulated | null> {
    return this.findPopulatedPrograms(filter)
      .findOne()
      .lean<IUserProgramPopulated | null>()
      .exec();
  }

  async findByUserAndPlan(
    userId: string | Types.ObjectId,
    planId: string | Types.ObjectId,
  ): Promise<IUserProgram[]> {
    return this._model
      .find({ userId, planId })
      .sort({ createdAt: -1 })
      .lean<IUserProgram[]>()
      .exec();
  }

  async findByIdAndUser(
    userId: string | Types.ObjectId,
    programId: string | Types.ObjectId,
  ): Promise<IUserProgram | null> {
    return this.findOne({
      _id: programId,
      userId,
    });
  }

  async findExistingPurchase(
    userId: string | Types.ObjectId,
    planId: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<IUserProgram | null> {
    return this.findOne(
      {
        userId,
        planId,
        status: { $in: BLOCKING_PURCHASE_STATUSES },
      },
      session,
    );
  }

  async activateUpcomingPrograms(): Promise<UpdateResult> {
    const now = new Date();

    return this._model.updateMany(
      {
        status: "upcoming",
        startDate: { $lte: now },
        endDate: { $gt: now },
      },
      {
        $set: {
          status: "active",
        },
      },
      {
        runValidators: true,
      },
    );
  }

  async completeActivePrograms(): Promise<UpdateResult> {
    const now = new Date();

    return this._model.updateMany(
      {
        status: "active",
        endDate: { $lte: now },
      },
      {
        $set: {
          status: "completed",
          "lifecycle.completedAt": now,
        },
      },
      {
        runValidators: true,
      },
    );
  }

  async findCoachingEligibleProgram(
    userId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<IUserProgram | null> {
    return this.findOne(
      {
        userId,
        nutritionistId,
        status: { $in: BLOCKING_PURCHASE_STATUSES },
      },
      session,
    );
  }
}
