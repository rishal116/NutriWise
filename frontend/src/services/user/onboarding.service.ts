import { api } from "@/lib/axios/api";

export interface CompleteProfileDto {
  gender: string;
  birthDate: string;
  heightCm: number;
  weightKg: number;
  activityLevel: string;
  dietType: string;
  goal: string;
  targetWeightKg?: number;
  preferredTimeline: string;
}

export const onboardingService = {
  completeProfile: async (data: CompleteProfileDto) => {
    const res = await api.patch("/complete-profile", data);
    return res.data;
  },
};