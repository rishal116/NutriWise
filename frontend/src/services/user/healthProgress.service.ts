import { api } from "@/lib/axios/api";

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
    getHealthProgress: async (days: number = 30): Promise<HealthProgressResponse> => {
        const res = await api.get(`/health-progress?days=${days}`);
        return res.data.data;
    },
    
    getProgressByDate: async (date: string): Promise<IHealthProgressData | null> => {
        const res = await api.get(`/health-progress/date?date=${date}`);
        return res.data.data;
    },
    
    getLatestProgress: async (): Promise<IHealthProgressData | null> => {
        const res = await api.get(`/health-progress/latest`);
        return res.data.data;
    },
};