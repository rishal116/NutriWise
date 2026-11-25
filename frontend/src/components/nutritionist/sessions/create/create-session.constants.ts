import type { CreateNutriSessionDTO } from "@/dtos/nutritionist/session/create-session.dto";
import type {
  SessionPricingType,
  SessionType,
} from "@/constants/common/session.constants";

export type SessionFormState = Omit<
  CreateNutriSessionDTO,
  "type" | "pricingType" | "pricing"
> & {
  type: SessionType | "";
  pricingType: SessionPricingType | "";
  pricing: NonNullable<CreateNutriSessionDTO["pricing"]>;
};

export const INITIAL_SESSION_FORM: SessionFormState = {
  title: "",
  description: "",
  type: "",
  pricingType: "",
  pricing: {
    amount: 0,
    currency: "inr",
  },
  scheduledAt: "",
  duration: 0,
  maxParticipants: 0,
};
