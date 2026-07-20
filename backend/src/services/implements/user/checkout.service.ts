import { ICheckoutService } from "../../interfaces/user/ICheckoutService";
import { IStripeService } from "../../interfaces/common/stripe/IStripeService";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { CreateCheckoutSessionDTO } from "../../../dtos/user/checkout/create-checkout-session.dto";
import { CheckoutStripeMapper } from "../../../mapper/user/checkout/checkout-stripe.mapper";
import { INutritionistPlanRepository } from "../../../repositories/interfaces/nutritionist/INutriPlanRepository";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { IUserRepository } from "../../../repositories/interfaces/user/IUserRepository";

@injectable()
export class CheckoutService implements ICheckoutService {
  constructor(
    @inject(TYPES.IStripeService)
    private readonly _stripeService: IStripeService,

    @inject(TYPES.INutritionistPlanRepository)
    private readonly _nutritionistPlanRepository: INutritionistPlanRepository,

    @inject(TYPES.IUserRepository)
    private readonly _userRepository: IUserRepository,
  ) {}

  async createCheckoutSession(dto: CreateCheckoutSessionDTO): Promise<string> {
    const plan = await this._nutritionistPlanRepository.findById(dto.planId);

    if (!plan) {
      throw new CustomError("Plan not found.", StatusCode.NOT_FOUND);
    }

    const nutritionistUser = await this._userRepository.findById(
      plan.nutritionistId.toString(),
    );

    if (!nutritionistUser) {
      throw new CustomError("Nutritionist not found.", StatusCode.NOT_FOUND);
    }
    const stripeCheckoutInput = CheckoutStripeMapper.toStripeInput(
      plan,
      dto.userId,
    );
    return this._stripeService.createCheckoutSession(stripeCheckoutInput);
  }
}
