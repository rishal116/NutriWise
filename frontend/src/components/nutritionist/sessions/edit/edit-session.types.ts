import type {
  SessionPricingType,
  SessionType,
} from "@/constants/common/session.constants";

export interface EditSessionFormState {
  title: string;
  description: string;
  type: SessionType;
  pricing: {
    type: SessionPricingType;
    amount: number;
    currency: "inr";
  };
  scheduledAt: string;
  durationInMinutes: number;
  maxParticipants?: number;
}
