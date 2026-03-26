import { BaseRepository } from "../common/base.repository";
import { IUserPlan, UserPlanModel } from "../../../models/userPlan.model";
import { IUserPlanRepository } from "../../interfaces/user/IUserPlanRepository";
import { IUserPlanPopulated } from "../../../types/userPlan.populated";
import { Types, ClientSession } from "mongoose";

export class UserPlanRepository
  extends BaseRepository<IUserPlan>
  implements IUserPlanRepository
{
  constructor() {
    super(UserPlanModel);
  }

  async create(
    data: Partial<IUserPlan>,
    session?: ClientSession,
  ): Promise<IUserPlan> {
    const doc = await this._model.create([data], { session });
    return doc[0];
  }

  async findBySessionId(sessionId: string): Promise<IUserPlan | null> {
    return this._model
      .findOne({ checkoutSessionId: sessionId, isDeleted: false })
      .exec();
  }

  async findActiveByUserAndNutritionist(
    userId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<IUserPlan | null> {
    return this._model
      .findOne({
        userId,
        nutritionistId,
        status: "ACTIVE",
        endDate: { $gt: new Date() },
        isDeleted: false,
      })
      .exec();
  }

  async findLatestPlan(
    userId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<IUserPlan | null> {
    return this._model
      .findOne({
        userId,
        nutritionistId,
        status: { $in: ["ACTIVE", "UPCOMING"] },
        isDeleted: false,
      })
      .sort({ endDate: -1 })
      .exec();
  }

  async findByUserId(
    userId: string | Types.ObjectId,
  ): Promise<IUserPlanPopulated[]> {
    const docs = await this._model
      .find({ userId, isDeleted: false })
      .populate("planId")
      .populate("nutritionistId")
      .populate("userId")
      .sort({ createdAt: -1 })
      .exec();

    return docs as unknown as IUserPlanPopulated[];
  }

  async findByNutritionistId(
    nutritionistId: string | Types.ObjectId,
  ): Promise<IUserPlanPopulated[]> {
    const docs = await this._model
      .find({ nutritionistId, isDeleted: false })
      .populate("userId")
      .populate("planId")
      .populate("nutritionistId")
      .sort({ createdAt: -1 })
      .exec();

    return docs as unknown as IUserPlanPopulated[];
  }

  async findOnePopulated(
    filter: Partial<IUserPlan>,
  ): Promise<IUserPlanPopulated | null> {
    const doc = await this._model
      .findOne({ ...filter, isDeleted: false })
      .populate("planId")
      .populate("nutritionistId")
      .populate("userId")
      .exec();

    return doc as unknown as IUserPlanPopulated | null;
  }

  async expireById(
    id: string | Types.ObjectId,
    session?: ClientSession,
  ): Promise<void> {
    await this._model.findByIdAndUpdate(
      id,
      {
        status: "EXPIRED",
        updatedAt: new Date(),
      },
      { session },
    );
  }

  async activatePlan(id: string | Types.ObjectId): Promise<IUserPlan | null> {
    return this._model.findByIdAndUpdate(
      id,
      {
        status: "ACTIVE",
        updatedAt: new Date(),
      },
      { new: true },
    );
  }

  async activateUpcomingPlans(): Promise<any> {
    return this._model.updateMany(
      {
        status: "UPCOMING",
        startDate: { $lte: new Date() },
        isDeleted: false,
      },
      {
        $set: { status: "ACTIVE" },
      },
    );
  }

  async expireActivePlans(): Promise<any> {
    return this._model.updateMany(
      {
        status: "ACTIVE",
        endDate: { $lt: new Date() },
        isDeleted: false,
      },
      {
        $set: { status: "EXPIRED" },
      },
    );
  }
}
