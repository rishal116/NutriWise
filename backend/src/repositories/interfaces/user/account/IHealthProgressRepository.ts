import type { ClientSession } from "mongoose";

import type { IHealthProgress } from "../../../../models/healthProgress.model";
import type { IBaseRepository } from "../../common/IBaseRepository";
import type { IUpsertDailyProgress } from "../../../../types/user/health-progress/health-progress.types";

export interface IHealthProgressRepository extends IBaseRepository<IHealthProgress> {
  upsertDailyProgress(
    data: IUpsertDailyProgress,
    session?: ClientSession,
  ): Promise<IHealthProgress | null>;

  findByUserAndDateRange(
    userId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<IHealthProgress[]>;

  findLatestByUserId(userId: string): Promise<IHealthProgress | null>;
}
