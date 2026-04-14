import { injectable } from "inversify";
import { Types } from "mongoose";
import { IHealthProgressRepository } from "../../interfaces/user/IHealthProgressRepository";
import {
  HealthProgressModel,
  IHealthProgress,
} from "../../../models/healthProgress.model";
import { IUpsertHealthProgressDTO } from "../../../dtos/user/healthProgress.dto";

@injectable()
export class HealthProgressRepository implements IHealthProgressRepository {
  private normalizeDate(date?: Date): Date {
    const d = date ? new Date(date) : new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  async upsertDailyProgress(
    data: IUpsertHealthProgressDTO,
  ): Promise<IHealthProgress> {
    const normalizedDate = this.normalizeDate(data.date);

    const updateFields: any = {};

    if (data.weightKg !== undefined) updateFields.weightKg = data.weightKg;
    if (data.bmi !== undefined) updateFields.bmi = data.bmi;
    if (data.dailyWaterIntakeLiters !== undefined)
      updateFields.dailyWaterIntakeLiters = data.dailyWaterIntakeLiters;
    if (data.sleepDurationHours !== undefined)
      updateFields.sleepDurationHours = data.sleepDurationHours;

    return await HealthProgressModel.findOneAndUpdate(
      {
        userId: new Types.ObjectId(data.userId),
        date: normalizedDate,
      },
      {
        $set: updateFields,
      },
      {
        upsert: true,
        new: true,
      },
    );
  }

  async findByUserAndDateRange(
    userId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<IHealthProgress[]> {
    return await HealthProgressModel.find({
      userId: new Types.ObjectId(userId),
      date: {
        $gte: this.normalizeDate(fromDate),
        $lte: this.normalizeDate(toDate),
      },
    }).sort({ date: 1 });
  }

  async findByUserId(userId: string): Promise<IHealthProgress[]> {
    return await HealthProgressModel.find({
      userId: new Types.ObjectId(userId),
    }).sort({ date: 1 });
  }

  async findLatestByUserId(userId: string): Promise<IHealthProgress | null> {
    return await HealthProgressModel.findOne({
      userId: new Types.ObjectId(userId),
    }).sort({ date: -1 });
  }
}
