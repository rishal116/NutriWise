import { container } from "./index";
import { TYPES } from "../types/types";

import { ICheckoutController } from "../controllers/interfaces/user/ICheckoutController";
import { CheckoutController } from "../controllers/implementations/user/checkout.controller";
import { ICheckoutService } from "../services/interfaces/user/ICheckoutService";
import { CheckoutService } from "../services/implements/user/checkout.service";


import { IOTPService } from "../services/interfaces/common/IOtpService";
import { OtpService } from "../services/implements/common/otp.service";
import { IOtpRepository } from "../repositories/interfaces/common/IOtpRepository";
import { OtpRepository } from "../repositories/implements/common/otp.repository";


import { IStripeService } from "../services/interfaces/common/IStripeService";
import { StripeService } from "../services/implements/common/stripe.service";
import { IStripeWebhookService } from "../services/interfaces/common/IStripeWebhookService";
import { StripeWebhookService } from "../services/implements/common/stripeWebhook.service";
import { IStripeWebhookController } from "../controllers/interfaces/common/IStripeWebhookController";
import { StripeWebhookController } from "../controllers/implementations/common/stripeWebhook.controller";


container.bind<ICheckoutController>(TYPES.ICheckoutController).to(CheckoutController);
container.bind<ICheckoutService>(TYPES.ICheckoutService).to(CheckoutService);
container.bind<IStripeService>(TYPES.IStripeService).to(StripeService);
container.bind<IStripeWebhookService>(TYPES.IStripeWebhookService).to(StripeWebhookService);
container.bind<IStripeWebhookController>(TYPES.IStripeWebhookController).to(StripeWebhookController);

container.bind<IOTPService>(TYPES.IOTPService).to(OtpService);
container.bind<IOtpRepository>(TYPES.IOtpRepository).to(OtpRepository);