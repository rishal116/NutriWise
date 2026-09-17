import { inject, injectable } from "inversify";

import { Types } from "mongoose";

import { TYPES } from "../../../types/types";

import { IPublicGroupRepository } from "../../../repositories/interfaces/public/IPublicGroupRepository";

import { IConversationMemberRepository } from "../../../repositories/interfaces/chat/IConversationMemberRepository";

import { IPublicGroupService } from "../../interfaces/public/IPublicGroupService";

import { CustomError } from "../../../utils/customError";

import { StatusCode } from "../../../enums/statusCode.enum";

import logger from "../../../utils/logger";

import { validateDto } from "../../../middlewares/validateDto.middleware";

import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

import { PublicGroupListQueryDTO } from "../../../dtos/public/group/public-group-list-query.dto";

import type { PublicGroupListItemDTO } from "../../../dtos/public/group/public-group-list-item.dto";

import type { PublicGroupDetailsDTO } from "../../../dtos/public/group/public-group-details.dto";

import { toPublicGroupListItemDTO } from "../../../mappers/public/group/public-group-list.mapper";

import { toPublicGroupDetailsDTO } from "../../../mappers/public/group/public-group-details.mapper";

@injectable()
export class PublicGroupService implements IPublicGroupService {
  constructor(
    @inject(TYPES.IPublicGroupRepository)
    private readonly _publicGroupRepository: IPublicGroupRepository,

    @inject(TYPES.IConversationMemberRepository)
    private readonly _conversationMemberRepository: IConversationMemberRepository,
  ) {}

  private validateGroupId(groupId: string): void {
    if (!groupId?.trim()) {
      throw new CustomError("Group ID is required", StatusCode.BAD_REQUEST);
    }

    if (!Types.ObjectId.isValid(groupId)) {
      throw new CustomError("Invalid group ID", StatusCode.BAD_REQUEST);
    }
  }

  private validateUserId(userId: string): void {
    if (!userId?.trim()) {
      throw new CustomError("User ID is required", StatusCode.BAD_REQUEST);
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid user ID", StatusCode.BAD_REQUEST);
    }
  }

  async browseGroups(
    query: PublicGroupListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<PublicGroupListItemDTO>> {
    logger.info("Browsing public groups", {
      query,
    });

    const validatedQuery = await validateDto(PublicGroupListQueryDTO, query);

    const result = await this._publicGroupRepository.findGroups(validatedQuery);

    const items = result.items.map((group) => toPublicGroupListItemDTO(group));

    logger.info("Public groups fetched successfully", {
      count: items.length,
    });

    return new InfiniteScrollResponseDTO(
      items,
      result.nextCursor,
      result.hasMore,
    );
  }

  async getGroup(groupId: string): Promise<PublicGroupDetailsDTO> {
    logger.info("Fetching public group details", {
      groupId,
    });

    this.validateGroupId(groupId);

    const group = await this._publicGroupRepository.findGroupById(groupId);

    if (!group) {
      throw new CustomError("Public group not found", StatusCode.NOT_FOUND);
    }

    const members =
      await this._conversationMemberRepository.findByConversationId(groupId);

    return toPublicGroupDetailsDTO(group, members.length);
  }

  async joinGroup(
    userId: string,
    groupId: string,
  ): Promise<PublicGroupDetailsDTO> {
    logger.info("Joining public group", {
      userId,
      groupId,
    });

    this.validateUserId(userId);
    this.validateGroupId(groupId);

    const group = await this._publicGroupRepository.findGroupById(groupId);

    if (!group) {
      throw new CustomError("Public group not found", StatusCode.NOT_FOUND);
    }

    const existingMember = await this._conversationMemberRepository.findMember(
      groupId,
      userId,
    );

    if (existingMember) {
      throw new CustomError(
        "You are already a member of this group",
        StatusCode.CONFLICT,
      );
    }

    await this._conversationMemberRepository.create({
      conversationId: group._id,
      userId: new Types.ObjectId(userId),
      role: "member",
      status: "active",
    });

    const members =
      await this._conversationMemberRepository.findByConversationId(groupId);

    logger.info("Public group joined successfully", {
      userId,
      groupId,
    });

    return toPublicGroupDetailsDTO(group, members.length);
  }
}
