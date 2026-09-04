import { CreateSessionCheckoutDTO } from "../../../dtos/public/session-registration/create-session-checkout.dto";

export interface ISessionCheckoutService {
  createCheckoutSession(dto: CreateSessionCheckoutDTO): Promise<string>;
}
