import type { StripeProgramDayCreationDTO } from "../../../../dtos/common/stripe/stripe-program-day-creation.dto";

export interface IStripeProgramDayCreationService {
  create(params: StripeProgramDayCreationDTO): Promise<void>;
}