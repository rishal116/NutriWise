import { clientApi } from "@/lib/axios/clientApi";
import { HEALTH_PROGRESS_ROUTES } from "@/routes/user";

export interface IProgressPoint {
  date: string;
  value: number;
}

export interface HealthProgressResponse {
  weightProgress: IProgressPoint[];
  bmiProgress: IProgressPoint[];
  waterProgress: IProgressPoint[];
  sleepProgress: IProgressPoint[];
}

export interface IHealthProgressData {
  date: string;
  weightKg?: number;
  bmi?: number;
  dailyWaterIntakeLiters?: number;
  sleepDurationHours?: number;
}

export const healthProgressService = {
  async getHealthProgress(days: number = 30): Promise<HealthProgressResponse> {
    const res = await clientApi.get<{
      success: boolean;
      data: HealthProgressResponse;
    }>(HEALTH_PROGRESS_ROUTES.GET_PROGRESS, {
      params: { days },
    });

    return res.data.data;
  },

  async getProgressByDate(date: string): Promise<IHealthProgressData | null> {
    const res = await clientApi.get<{
      success: boolean;
      data: IHealthProgressData | null;
    }>(HEALTH_PROGRESS_ROUTES.GET_BY_DATE, {
      params: { date },
    });

    return res.data.data;
  },

  async getLatestProgress(): Promise<IHealthProgressData | null> {
    const res = await clientApi.get<{
      success: boolean;
      data: IHealthProgressData | null;
    }>(HEALTH_PROGRESS_ROUTES.GET_LATEST);

    return res.data.data;
  },
};
