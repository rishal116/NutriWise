import { inject, injectable } from "inversify";

import { Types } from "mongoose";

import { TYPES } from "../../../types/types";

import { IPublicResourceService } from "../../interfaces/public/IPublicResourceService";

import { IResourceRepository } from "../../../repositories/interfaces/public/IResourceRepository";

import { IResourceViewRepository } from "../../../repositories/interfaces/public/IResourceViewRepository";

import { IResourceLikeRepository } from "../../../repositories/interfaces/public/IResourceLikeRepository";

import { IResourceBookmarkRepository } from "../../../repositories/interfaces/public/IResourceBookmarkRepository";

import { IResourceCommentRepository } from "../../../repositories/interfaces/public/IResourceCommentRepository";

import { PublicResourceListQueryDTO } from "../../../dtos/public/resource/public-resource-list-query.dto";

import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

import { PublicResourceListItemDTO } from "../../../dtos/public/resource/public-resource-list-item.dto";

import { PublicResourceDetailsDTO } from "../../../dtos/public/resource/public-resource-details.dto";

import { CustomError } from "../../../utils/customError";

import logger from "../../../utils/logger";

import { PublicResourceMapper } from "../../../mappers/public/resource/public-resource.mapper";

@injectable()
export class PublicResourceService implements IPublicResourceService {
  constructor(
    @inject(TYPES.IResourceRepository)
    private readonly _resourceRepository: IResourceRepository,

    @inject(TYPES.IResourceViewRepository)
    private readonly _resourceViewRepository: IResourceViewRepository,

    @inject(TYPES.IResourceLikeRepository)
    private readonly _resourceLikeRepository: IResourceLikeRepository,

    @inject(TYPES.IResourceBookmarkRepository)
    private readonly _resourceBookmarkRepository: IResourceBookmarkRepository,

    @inject(TYPES.IResourceCommentRepository)
    private readonly _resourceCommentRepository: IResourceCommentRepository,
  ) {}

  async getPublicResources(
    query: PublicResourceListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<PublicResourceListItemDTO>> {
    logger.debug("Fetching public resources");

    const result = await this._resourceRepository.findPublicResources(query);

    const items = result.items.map((resource) =>
      PublicResourceMapper.toListItemDTO(resource),
    );

    return new InfiniteScrollResponseDTO(
      items,
      result.nextCursor ?? null,
      result.hasMore,
    );
  }

  async getPublicResourceDetails(
    resourceId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<PublicResourceDetailsDTO> {
    logger.debug(
      "Fetching public resource details. resourceId=%s",
      resourceId.toString(),
    );

    this.validateResourceId(resourceId);

    const resource =
      await this._resourceRepository.findPublicResourceDetails(resourceId);

    if (!resource) {
      throw new CustomError("Resource not found", 404);
    }

    const comments =
      await this._resourceCommentRepository.findByResource(resourceId);

    const [isLiked, isBookmarked] = await Promise.all([
      this._resourceLikeRepository.existsByResourceAndUser(resourceId, userId),
      this._resourceBookmarkRepository.existsByResourceAndUser(
        resourceId,
        userId,
      ),
    ]);

    return PublicResourceMapper.toDetailsDTO(resource, comments, {
      isLiked,
      isBookmarked,
    });
  }

  async recordResourceView(
    resourceId: string | Types.ObjectId,
    userId?: string | Types.ObjectId,
    sessionId?: string,
  ): Promise<void> {
    logger.debug(
      "Recording resource view. resourceId=%s",
      resourceId.toString(),
    );

    this.validateResourceId(resourceId);

    const resource =
      await this._resourceRepository.findPublicResourceDetails(resourceId);

    if (!resource) {
      throw new CustomError("Resource not found", 404);
    }

    const hasViewedRecently = await this._resourceViewRepository.recordView(
      resourceId,
      userId,
      sessionId,
    );

    if (hasViewedRecently) {
      return;
    }

    await this._resourceViewRepository.create({
      resourceId:
        typeof resourceId === "string"
          ? new Types.ObjectId(resourceId)
          : resourceId,
      userId: typeof userId === "string" ? new Types.ObjectId(userId) : userId,
      sessionId,
    });

    await this._resourceRepository.incrementViewCount(resourceId);
  }

  async likeResource(
    resourceId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<void> {
    logger.debug(
      "Liking resource. resourceId=%s userId=%s",
      resourceId.toString(),
      userId.toString(),
    );

    this.validateResourceId(resourceId);
    this.validateUserId(userId);

    const resource =
      await this._resourceRepository.findPublicResourceDetails(resourceId);

    if (!resource) {
      throw new CustomError("Resource not found", 404);
    }

    const alreadyLiked =
      await this._resourceLikeRepository.existsByResourceAndUser(
        resourceId,
        userId,
      );

    if (alreadyLiked) {
      return;
    }

    await this._resourceLikeRepository.create({
      resourceId:
        typeof resourceId === "string"
          ? new Types.ObjectId(resourceId)
          : resourceId,
      userId: typeof userId === "string" ? new Types.ObjectId(userId) : userId,
    });

    await this._resourceRepository.incrementLikeCount(resourceId);
  }

  async unlikeResource(
    resourceId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<void> {
    logger.debug(
      "Unliking resource. resourceId=%s userId=%s",
      resourceId.toString(),
      userId.toString(),
    );

    this.validateResourceId(resourceId);
    this.validateUserId(userId);

    const deleted = await this._resourceLikeRepository.deleteByResourceAndUser(
      resourceId,
      userId,
    );

    if (!deleted) {
      return;
    }

    await this._resourceRepository.decrementLikeCount(resourceId);
  }

  async bookmarkResource(
    resourceId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<void> {
    logger.debug(
      "Bookmarking resource. resourceId=%s userId=%s",
      resourceId.toString(),
      userId.toString(),
    );

    this.validateResourceId(resourceId);
    this.validateUserId(userId);

    const resource =
      await this._resourceRepository.findPublicResourceDetails(resourceId);

    if (!resource) {
      throw new CustomError("Resource not found", 404);
    }

    const alreadyBookmarked =
      await this._resourceBookmarkRepository.existsByResourceAndUser(
        resourceId,
        userId,
      );

    if (alreadyBookmarked) {
      return;
    }

    await this._resourceBookmarkRepository.create({
      resourceId:
        typeof resourceId === "string"
          ? new Types.ObjectId(resourceId)
          : resourceId,
      userId: typeof userId === "string" ? new Types.ObjectId(userId) : userId,
    });

    await this._resourceRepository.incrementBookmarkCount(resourceId);
  }

  async unbookmarkResource(
    resourceId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<void> {
    logger.debug(
      "Removing resource bookmark. resourceId=%s userId=%s",
      resourceId.toString(),
      userId.toString(),
    );

    this.validateResourceId(resourceId);
    this.validateUserId(userId);

    const deleted =
      await this._resourceBookmarkRepository.deleteByResourceAndUser(
        resourceId,
        userId,
      );

    if (!deleted) {
      return;
    }

    await this._resourceRepository.decrementBookmarkCount(resourceId);
  }

  async addResourceComment(
    resourceId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    content: string,
  ): Promise<void> {
    logger.debug(
      "Adding resource comment. resourceId=%s userId=%s",
      resourceId.toString(),
      userId.toString(),
    );

    this.validateResourceId(resourceId);
    this.validateUserId(userId);

    const resource =
      await this._resourceRepository.findPublicResourceDetails(resourceId);

    if (!resource) {
      throw new CustomError("Resource not found", 404);
    }

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      throw new CustomError("Comment content is required", 400);
    }

    await this._resourceCommentRepository.create({
      resourceId:
        typeof resourceId === "string"
          ? new Types.ObjectId(resourceId)
          : resourceId,
      userId: typeof userId === "string" ? new Types.ObjectId(userId) : userId,
      content: trimmedContent,
      isEdited: false,
      isDeleted: false,
    });

    await this._resourceRepository.incrementCommentCount(resourceId);
  }

  async deleteResourceComment(
    commentId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
  ): Promise<void> {
    logger.debug(
      "Deleting resource comment. commentId=%s userId=%s",
      commentId.toString(),
      userId.toString(),
    );

    this.validateResourceId(commentId);
    this.validateUserId(userId);

    const deleted =
      await this._resourceCommentRepository.deleteByResourceAndUser(
        commentId,
        userId,
      );

    if (!deleted) {
      throw new CustomError("Comment not found", 404);
    }

    const comment = await this._resourceCommentRepository.findOne({
      _id: commentId,
    });

    if (comment) {
      await this._resourceRepository.decrementCommentCount(comment.resourceId);
    }
  }

  private validateResourceId(resourceId: string | Types.ObjectId): void {
    if (!Types.ObjectId.isValid(resourceId)) {
      throw new CustomError("Invalid resource ID", 400);
    }
  }

  private validateUserId(userId: string | Types.ObjectId): void {
    if (!Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid user ID", 400);
    }
  }
}
