import { HealthProgressResponseDTO, IHealthProgressData } from "../../../dtos/user/healthProgress.dto";

export interface IHealthProgressService {
  getHealthProgress(
    userId: string,
    days?: number
  ): Promise<HealthProgressResponseDTO>;

  getProgressByDate(
    userId: string,
    date: Date
  ): Promise<IHealthProgressData | null>;

  getLatestProgress(
    userId: string
  ): Promise<IHealthProgressData | null>;
}