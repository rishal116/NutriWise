import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";

import type { IAdminSubscriptionPlanService } from "../../interfaces/admin/IAdminSubscriptionPlanService";
import type { IAdminSubscriptionPlanRepository } from "../../../repositories/interfaces/admin/IAdminSubscriptionPlanRepository";

import { AdminSubscriptionPlanListQueryDTO } from "../../../dtos/admin/subscription-plan/admin-subscription-plan-list-query.dto";
import { CreateSubscriptionPlanDTO } from "../../../dtos/admin/subscription-plan/create-subscription-plan.dto";
import { UpdateSubscriptionPlanDTO } from "../../../dtos/admin/subscription-plan/update-subscription-plan.dto";

import type { AdminSubscriptionPlanCardDTO } from "../../../dtos/admin/subscription-plan/admin-subscription-plan-card.dto";
import type { AdminSubscriptionPlanDetailsDTO } from "../../../dtos/admin/subscription-plan/admin-subscription-plan-details.dto";

import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { validateDto } from "../../../middlewares/validateDto.middleware";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";

import { toAdminSubscriptionPlanCardDTO } from "../../../mappers/admin/subscription-plan/admin-subscription-plan-list.mapper";
import { toAdminSubscriptionPlanDetailsDTO } from "../../../mappers/admin/subscription-plan/admin-subscription-plan-details.mapper";
import { toObjectId } from "../../../utils/object-id.util";
import { generateUniqueSubscriptionPlanSlug } from "../../../utils/subscription-plan-slug";
import { CURRENCY } from "../../../constants/common/currency.constants";

@injectable()
export class AdminSubscriptionPlanService implements IAdminSubscriptionPlanService {
  constructor(
    @inject(TYPES.IAdminSubscriptionPlanRepository)
    private readonly _adminSubscriptionPlanRepository: IAdminSubscriptionPlanRepository,
  ) {}

  async createPlan(data: CreateSubscriptionPlanDTO): Promise<void> {
    logger.info("Creating subscription plan", {
      audience: data.audience,
    });

    const validatedData = await validateDto(CreateSubscriptionPlanDTO, data);

    const slug = await generateUniqueSubscriptionPlanSlug(
      this._adminSubscriptionPlanRepository,
      validatedData.audience,
      validatedData.name,
    );

    const subscriptionPlan = await this._adminSubscriptionPlanRepository.create(
      {
        ...validatedData,
        slug,
        billing: {
          ...validatedData.billing,
          currency: CURRENCY,
        },
        status: "draft",
        providerReferences: {
          stripePriceId: null,
        },
      },
    );

    logger.info("Subscription plan created successfully", {
      planId: subscriptionPlan._id.toString(),
      audience: subscriptionPlan.audience,
      slug: subscriptionPlan.slug,
    });
  }

  async browsePlans(
    query: AdminSubscriptionPlanListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<AdminSubscriptionPlanCardDTO>> {
    logger.info("Browsing admin subscription plans");

    const validatedQuery = await validateDto(
      AdminSubscriptionPlanListQueryDTO,
      query,
    );

    const result =
      await this._adminSubscriptionPlanRepository.findPlans(validatedQuery);

    const items = result.items.map(toAdminSubscriptionPlanCardDTO);

    logger.info("Admin subscription plans retrieved successfully", {
      count: items.length,
      hasMore: result.hasMore,
    });

    return new InfiniteScrollResponseDTO(
      items,
      result.nextCursor,
      result.hasMore,
    );
  }

  async getPlan(planId: string): Promise<AdminSubscriptionPlanDetailsDTO> {
    logger.info("Fetching subscription plan details", { planId });

    const planObjectId = toObjectId(planId, "subscription plan ID");

    const subscriptionPlan =
      await this._adminSubscriptionPlanRepository.findById(planObjectId);

    if (!subscriptionPlan) {
      throw new CustomError(
        "Subscription plan not found",
        StatusCode.NOT_FOUND,
      );
    }

    logger.info("Subscription plan details retrieved successfully", {
      planId,
    });

    return toAdminSubscriptionPlanDetailsDTO(subscriptionPlan);
  }

  async updatePlan(
    planId: string,
    data: UpdateSubscriptionPlanDTO,
  ): Promise<void> {
    logger.info("Updating subscription plan", { planId });

    const planObjectId = toObjectId(planId, "subscription plan ID");

    const validatedData = await validateDto(UpdateSubscriptionPlanDTO, data);

    if (Object.keys(validatedData).length === 0) {
      throw new CustomError(
        "At least one field is required to update the subscription plan",
        StatusCode.BAD_REQUEST,
      );
    }

    const existingPlan =
      await this._adminSubscriptionPlanRepository.findById(planObjectId);

    if (!existingPlan) {
      throw new CustomError(
        "Subscription plan not found",
        StatusCode.NOT_FOUND,
      );
    }

    if (existingPlan.status === "archived") {
      throw new CustomError(
        "Archived subscription plans cannot be updated",
        StatusCode.BAD_REQUEST,
      );
    }

    const updateData = {
      ...validatedData,
      ...(validatedData.billing && {
        billing: {
          ...validatedData.billing,
          currency: CURRENCY,
        },
      }),
    };

    const updatedPlan = await this._adminSubscriptionPlanRepository.updateById(
      planObjectId,
      updateData,
    );

    if (!updatedPlan) {
      throw new CustomError(
        "Failed to update subscription plan",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    logger.info("Subscription plan updated successfully", { planId });
  }
  async publishPlan(planId: string): Promise<void> {
    logger.info("Publishing subscription plan", { planId });

    const planObjectId = toObjectId(planId, "subscription plan ID");

    const subscriptionPlan =
      await this._adminSubscriptionPlanRepository.findById(planObjectId);

    if (!subscriptionPlan) {
      throw new CustomError(
        "Subscription plan not found",
        StatusCode.NOT_FOUND,
      );
    }

    if (subscriptionPlan.status === "archived") {
      throw new CustomError(
        "Archived subscription plans cannot be published",
        StatusCode.BAD_REQUEST,
      );
    }

    if (subscriptionPlan.status === "published") {
      throw new CustomError(
        "Subscription plan is already published",
        StatusCode.BAD_REQUEST,
      );
    }

    const publishedPlanCount =
      await this._adminSubscriptionPlanRepository.countDocuments({
        audience: subscriptionPlan.audience,
        status: "published",
      });

    if (publishedPlanCount >= 3) {
      throw new CustomError(
        `Maximum of 3 published plans allowed for ${subscriptionPlan.audience} audience`,
        StatusCode.BAD_REQUEST,
      );
    }

    const updatedPlan = await this._adminSubscriptionPlanRepository.updateById(
      planObjectId,
      { status: "published" },
    );

    if (!updatedPlan) {
      throw new CustomError(
        "Failed to publish subscription plan",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    logger.info("Subscription plan published successfully", { planId });
  }

  async archivePlan(planId: string): Promise<void> {
    logger.info("Archiving subscription plan", { planId });

    const planObjectId = toObjectId(planId, "subscription plan ID");

    const subscriptionPlan =
      await this._adminSubscriptionPlanRepository.findById(planObjectId);

    if (!subscriptionPlan) {
      throw new CustomError(
        "Subscription plan not found",
        StatusCode.NOT_FOUND,
      );
    }

    if (subscriptionPlan.status !== "published") {
      throw new CustomError(
        "Only published subscription plans can be archived",
        StatusCode.BAD_REQUEST,
      );
    }

    const updatedPlan = await this._adminSubscriptionPlanRepository.updateById(
      planObjectId,
      { status: "archived" },
    );

    if (!updatedPlan) {
      throw new CustomError(
        "Failed to archive subscription plan",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    logger.info("Subscription plan archived successfully", { planId });
  }
}
