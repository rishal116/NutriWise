import { injectable } from "inversify";
import { Types, type ClientSession } from "mongoose";

import {
  HealthProgressModel,
  type IHealthProgress,
} from "../../../../models/healthProgress.model";
import type { IHealthProgressRepository } from "../../../interfaces/user/account/IHealthProgressRepository";
import type { IUpsertDailyProgress } from "../../../../types/user/health-progress/health-progress.types";
import { BaseRepository } from "../../common/base.repository";

@injectable()
export class HealthProgressRepository
  extends BaseRepository<IHealthProgress>
  implements IHealthProgressRepository
{
  constructor() {
    super(HealthProgressModel);
  }

  private normalizeDate(date: Date = new Date()): Date {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    return normalizedDate;
  }

  async upsertDailyProgress(
    data: IUpsertDailyProgress,
    session?: ClientSession,
  ): Promise<IHealthProgress | null> {
    if (!Types.ObjectId.isValid(data.userId)) {
      return null;
    }

    const userId = new Types.ObjectId(data.userId);
    const date = this.normalizeDate(data.date);

    const { weightKg, bmi, dailyWaterIntakeLiters, sleepDurationHours } = data;

    const updateFields: Partial<
      Pick<
        IHealthProgress,
        "weightKg" | "bmi" | "dailyWaterIntakeLiters" | "sleepDurationHours"
      >
    > = {};

    if (weightKg !== undefined) updateFields.weightKg = weightKg;
    if (bmi !== undefined) updateFields.bmi = bmi;

    if (dailyWaterIntakeLiters !== undefined) {
      updateFields.dailyWaterIntakeLiters = dailyWaterIntakeLiters;
    }

    if (sleepDurationHours !== undefined) {
      updateFields.sleepDurationHours = sleepDurationHours;
    }

    return this._model
      .findOneAndUpdate(
        { userId, date },
        {
          $set: updateFields,
          $setOnInsert: { userId, date },
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true,
          session,
        },
      )
      .exec();
  }

  async findByUserAndDateRange(
    userId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<IHealthProgress[]> {
    if (!Types.ObjectId.isValid(userId)) {
      return [];
    }

    const startDate = this.normalizeDate(fromDate);
    const endDate = this.normalizeDate(toDate);
    endDate.setDate(endDate.getDate() + 1);

    return this._model
      .find({
        userId: new Types.ObjectId(userId),
        date: { $gte: startDate, $lt: endDate },
      })
      .sort({ date: 1 })
      .exec();
  }

  async findLatestByUserId(userId: string): Promise<IHealthProgress | null> {
    if (!Types.ObjectId.isValid(userId)) {
      return null;
    }

    return this._model
      .findOne({ userId: new Types.ObjectId(userId) })
      .sort({ date: -1 })
      .exec();
  }
}
