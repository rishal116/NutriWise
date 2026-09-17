import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../types/types";

import { IAdminPlanService } from "../../interfaces/admin/IAdminPlanService";
import { IAdminPlanRepository } from "../../../repositories/interfaces/admin/IAdminPlanRepository";

import { AdminPlanListQueryDTO } from "../../../dtos/admin/plan/admin-plan-list-query.dto";
import { AdminPlanListItemDTO } from "../../../dtos/admin/plan/admin-plan-list-item.dto";

import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";

import { validateDto } from "../../../middlewares/validateDto.middleware";

import { toAdminPlanListItemDTO } from "../../../mappers/admin/plan/admin-plan-list.mapper";

@injectable()
export class AdminPlanService implements IAdminPlanService {
  constructor(
    @inject(TYPES.IAdminPlanRepository)
    private readonly _adminPlanRepository: IAdminPlanRepository,
  ) {}

  async browsePlans(
    query: AdminPlanListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<AdminPlanListItemDTO>> {
    const validatedQuery = await validateDto(AdminPlanListQueryDTO, query);

    const result = await this._adminPlanRepository.findPlans(validatedQuery);

    const items = result.items.map(toAdminPlanListItemDTO);

    return new InfiniteScrollResponseDTO(
      items,
      result.nextCursor,
      result.hasMore,
    );
  }

  async archivePlan(planId: string): Promise<AdminPlanListItemDTO> {
    if (!planId?.trim()) {
      throw new CustomError("Plan ID is required", StatusCode.BAD_REQUEST);
    }

    if (!Types.ObjectId.isValid(planId)) {
      throw new CustomError("Invalid plan ID", StatusCode.BAD_REQUEST);
    }

    const plan = await this._adminPlanRepository.archivePlan(planId);

    if (!plan) {
      throw new CustomError(
        "Plan not found or cannot be archived",
        StatusCode.NOT_FOUND,
      );
    }

    return toAdminPlanListItemDTO(plan);
  }
}
