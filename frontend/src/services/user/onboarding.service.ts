import { clientApi } from "@/lib/axios/clientApi";

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
    const res = await clientApi.patch("/complete-profile", data);
    return res.data;
  },
};