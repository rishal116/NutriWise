import { createHash, randomBytes } from "node:crypto";
import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../../types/types";
import type { INutriGroupService } from "../../interfaces/nutritionist/INutriGroupService";
import type { INutriGroupRepository } from "../../../repositories/interfaces/nutritionist/INutriGroupRepository";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { validateDto } from "../../../middlewares/validateDto.middleware";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { CreateGroupDTO } from "../../../dtos/nutritionist/group/create-group.dto";
import { GroupCardDTO } from "../../../dtos/nutritionist/group/group-card.dto";
import { GroupDetailsDTO } from "../../../dtos/nutritionist/group/group-details.dto";
import { NutritionistGroupListQueryDTO } from "../../../dtos/nutritionist/group/group-list-query.dto";
import { toGroupCardDTO } from "../../../mappers/nutritionist/group/nutri-group-list.mapper";
import { toGroupDetailsDTO } from "../../../mappers/nutritionist/group/nutri-group-details.mapper";

@injectable()
export class NutriGroupService implements INutriGroupService {
  constructor(
    @inject(TYPES.INutriGroupRepository)
    private readonly _groupRepository: INutriGroupRepository,
  ) {}

  private validateId(id: string, fieldName: string): void {
    if (!id?.trim()) {
      throw new CustomError(`${fieldName} is required`, StatusCode.BAD_REQUEST);
    }

    if (!Types.ObjectId.isValid(id)) {
      throw new CustomError(`Invalid ${fieldName}`, StatusCode.BAD_REQUEST);
    }
  }

  async createGroup(
    nutritionistId: string,
    data: CreateGroupDTO,
  ): Promise<GroupDetailsDTO> {
    logger.info("Creating nutritionist group", {
      nutritionistId,
      title: data.title,
    });

    this.validateId(nutritionistId, "Nutritionist ID");

    const validatedData = await validateDto(CreateGroupDTO, data);
    const isPrivateGroup = validatedData.visibility === "private";

    const inviteToken = isPrivateGroup
      ? randomBytes(32).toString("hex")
      : undefined;

    const inviteTokenHash = inviteToken
      ? createHash("sha256").update(inviteToken).digest("hex")
      : undefined;

    const group = await this._groupRepository.createGroup(nutritionistId, {
      title: validatedData.title.trim(),
      description: validatedData.description?.trim() || undefined,
      groupAvatar: validatedData.groupAvatar?.trim() || undefined,
      visibility: validatedData.visibility,
      inviteToken,
      inviteTokenHash,
    });

    const result = await this._groupRepository.findGroupDetails(
      nutritionistId,
      group._id.toString(),
    );

    if (!result) {
      throw new CustomError(
        "Group created but could not be retrieved",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    logger.info("Nutritionist group created successfully", {
      nutritionistId,
      groupId: group._id.toString(),
      visibility: validatedData.visibility,
    });

    return toGroupDetailsDTO(result, inviteToken);
  }

  async browseGroups(
    nutritionistId: string,
    query: NutritionistGroupListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<GroupCardDTO>> {
    logger.info("Browsing nutritionist groups", {
      nutritionistId,
      query,
    });

    this.validateId(nutritionistId, "Nutritionist ID");

    const validatedQuery = await validateDto(
      NutritionistGroupListQueryDTO,
      query,
    );

    const result = await this._groupRepository.findGroups(
      nutritionistId,
      validatedQuery,
    );

    const items = result.items.map((group) => toGroupCardDTO(group));

    logger.info("Nutritionist groups fetched successfully", {
      nutritionistId,
      count: items.length,
    });

    return new InfiniteScrollResponseDTO(
      items,
      result.nextCursor,
      result.hasMore,
    );
  }

  async getGroup(
    nutritionistId: string,
    groupId: string,
  ): Promise<GroupDetailsDTO> {
    logger.info("Fetching nutritionist group details", {
      nutritionistId,
      groupId,
    });

    this.validateId(nutritionistId, "Nutritionist ID");
    this.validateId(groupId, "Group ID");

    const result = await this._groupRepository.findGroupDetails(
      nutritionistId,
      groupId,
    );

    if (!result) {
      throw new CustomError("Group not found", StatusCode.NOT_FOUND);
    }

    return toGroupDetailsDTO(result, result.inviteToken);
  }
}
