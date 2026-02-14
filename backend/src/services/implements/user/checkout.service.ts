import { ICheckoutService } from "../../interfaces/user/ICheckoutService"
import { IStripeService } from "../../interfaces/common/IStripeService";
import { injectable,inject } from "inversify";
import {TYPES} from "../../../types/types"
import { CreateCheckoutSessionDTO } from "../../../dtos/user/checkout.dto";
import { CheckoutStripeMapper } from "../../../mapper/user/checkout.mapper";
import { INutritionistPlanRepository } from "../../../repositories/interfaces/nutritionist/INutritionistPlanRepository";

@injectable()
export class CheckoutService implements ICheckoutService {
  constructor(
    @inject(TYPES.IStripeService) private _stripeService: IStripeService,
    @inject(TYPES.INutritionistPlanRepository) private _planRepo: INutritionistPlanRepository
  ) {}

  async createSession(dto: CreateCheckoutSessionDTO): Promise<string> {
    const plan = await this._planRepo.findById(dto.planId);
    if (!plan) throw new Error("Plan not found");
    const stripeInput = CheckoutStripeMapper.toStripeInput(plan, dto.userId);
    return this._stripeService.createCheckoutSession(stripeInput);
  }
}
