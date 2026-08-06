import { BaseRepository } from "../../common/base.repository";
import { IUserPlan, UserPlanModel } from "../../../../models/userPlan.model";
import { IUserPlanRepository } from "../../../interfaces/user/program/IUserPlanRepository";
import { IUserPlanPopulated } from "../../../../types/userPlan.populated";
import {
  ClientSession,
  FilterQuery,
  Types,
  UpdateQuery,
  UpdateResult,
} from "mongoose";

export class UserPlanRepository
  extends BaseRepository<IUserPlan>
  implements IUserPlanRepository
{
  constructor() {
    super(UserPlanModel);
  }


  async updateByIdWithSession(
    id: string | Types.ObjectId,
    update: UpdateQuery<IUserPlan>,
    session: ClientSession,
  ): Promise<IUserPlan | null> {
    return this._model.findByIdAndUpdate(id, update, {
      new: true,
      session,
    });
  }

  async updateOneWithSession(
    filter: FilterQuery<IUserPlan>,
    update: UpdateQuery<IUserPlan>,
    session: ClientSession,
  ): Promise<number> {
    const result = await this._model.updateOne(filter, update, {
      session,
    });

    return result.modifiedCount;
  }

  async findBySessionId(sessionId: string): Promise<IUserPlan | null> {
    return this._model.findOne({
      stripeCheckoutSessionId: sessionId,
    });
  }

  async findActiveByUserAndNutritionist(
    userId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<IUserPlan | null> {
    return this._model.findOne({
      userId,
      nutritionistId,
      subscriptionStatus: "active",
      endDate: { $gt: new Date() },
    });
  }

  async findLatestPlan(
    userId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<IUserPlan | null> {
    return this._model
      .findOne({
        userId,
        nutritionistId,
      })
      .sort({ createdAt: -1 });
  }

  async findByUserId(
    userId: string | Types.ObjectId,
  ): Promise<IUserPlanPopulated[]> {
    const docs = await this._model
      .find({ userId })
      .populate("userId")
      .populate("nutritionistId")
      .populate("planId")
      .sort({ createdAt: -1 });

    return docs as unknown as IUserPlanPopulated[];
  }

  async findByNutritionistId(
    nutritionistId: string | Types.ObjectId,
  ): Promise<IUserPlanPopulated[]> {
    const docs = await this._model
      .find({ nutritionistId })
      .populate("userId")
      .populate("nutritionistId")
      .populate("planId")
      .sort({ createdAt: -1 });

    return docs as unknown as IUserPlanPopulated[];
  }

  async findOnePopulated(
    filter: FilterQuery<IUserPlan>,
  ): Promise<IUserPlanPopulated | null> {
    const doc = await this._model
      .findOne(filter)
      .populate("userId")
      .populate("nutritionistId")
      .populate("planId");

    return doc as IUserPlanPopulated | null;
  }

  async activatePlan(id: string | Types.ObjectId): Promise<IUserPlan | null> {
    return this._model.findByIdAndUpdate(
      id,
      {
        subscriptionStatus: "active",
      },
      {
        new: true,
      },
    );
  }

  async expireById(
    id: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<void> {
    await this._model.findByIdAndUpdate(
      id,
      {
        subscriptionStatus: "expired",
      },
      { session },
    );
  }

  async activateUpcomingPlans(): Promise<UpdateResult> {
    return this._model.updateMany(
      {
        subscriptionStatus: "pending",
        startDate: { $lte: new Date() },
      },
      {
        $set: {
          subscriptionStatus: "active",
        },
      },
    );
  }

  async expireActivePlans(): Promise<UpdateResult> {
    return this._model.updateMany(
      {
        subscriptionStatus: "active",
        endDate: { $lt: new Date() },
      },
      {
        $set: {
          subscriptionStatus: "expired",
        },
      },
    );
  }
}
