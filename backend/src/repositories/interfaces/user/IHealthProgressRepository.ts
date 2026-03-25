import { IHealthProgress } from "../../../models/healthProgress.model";
import { IUpsertHealthProgressDTO } from "../../../dtos/user/healthProgress.dto";

export interface IHealthProgressRepository {
  // ✅ Create or update same-day record
  upsertDailyProgress(
    data: IUpsertHealthProgressDTO
  ): Promise<IHealthProgress>;

  // ✅ Get all progress (sorted)
  findByUserId(userId: string): Promise<IHealthProgress[]>;

  // ✅ Get range (for graphs)
  findByUserAndDateRange(
    userId: string,
    fromDate: Date,
    toDate: Date
  ): Promise<IHealthProgress[]>;

  // ✅ Get latest record (very useful)
  findLatestByUserId(userId: string): Promise<IHealthProgress | null>;
}