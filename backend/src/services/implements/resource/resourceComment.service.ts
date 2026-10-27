import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../types/types";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";

import { IResourceCommentRepository } from "../../../repositories/interfaces/resource/IResourceCommentRepository";
import { IResourceRepository } from "../../../repositories/interfaces/resource/IResourceRepository";
import { IResourceCommentService } from "../../interfaces/resource/IResourceCommentService";

import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { ResourceCommentDTO } from "../../../dtos/public/resource/resource-comment.dto";
import { ResourceCommentMapper } from "../../../mappers/resource/resource-comment.mapper";

@injectable()
export class ResourceCommentService implements IResourceCommentService {
  constructor(
    @inject(TYPES.IResourceCommentRepository)
    private readonly _resourceCommentRepository: IResourceCommentRepository,

    @inject(TYPES.IResourceRepository)
    private readonly _resourceRepository: IResourceRepository,
  ) {}

  async addComment(
    resourceId: string,
    userId: string,
    content: string,
  ): Promise<void> {
    if (
      !Types.ObjectId.isValid(resourceId) ||
      !Types.ObjectId.isValid(userId)
    ) {
      throw new CustomError(
        "Invalid resource or user ID",
        StatusCode.BAD_REQUEST,
      );
    }

    const trimmedContent = content.trim();

    if (!trimmedContent || trimmedContent.length > 2000) {
      throw new CustomError(
        "Comment must contain between 1 and 2000 characters",
        StatusCode.BAD_REQUEST,
      );
    }

    const resource = await this._resourceRepository.findById(resourceId);

    if (!resource) {
      throw new CustomError("Resource not found", StatusCode.NOT_FOUND);
    }

    await this._resourceCommentRepository.create({
      resourceId: new Types.ObjectId(resourceId),
      userId: new Types.ObjectId(userId),
      content: trimmedContent,
    });

    const updatedCount =
      await this._resourceRepository.incrementCommentCount(resourceId);

    if (updatedCount === 0) {
      throw new CustomError(
        "Failed to update resource comment count",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getComments(
    resourceId: string,
    limit = 10,
    cursor?: string,
  ): Promise<InfiniteScrollResponseDTO<ResourceCommentDTO>> {
    if (!Types.ObjectId.isValid(resourceId)) {
      throw new CustomError("Invalid resource ID", StatusCode.BAD_REQUEST);
    }

    const resource = await this._resourceRepository.findById(resourceId);

    if (!resource) {
      throw new CustomError("Resource not found", StatusCode.NOT_FOUND);
    }

    const safeLimit = Number.isFinite(limit)
      ? Math.min(Math.max(Math.floor(limit), 1), 50)
      : 10;

    const result = await this._resourceCommentRepository.findByResourceId(
      new Types.ObjectId(resourceId),
      safeLimit,
      cursor,
    );

    return new InfiniteScrollResponseDTO(
      result.items.map((comment) => ResourceCommentMapper.toDTO(comment)),
      result.nextCursor,
      result.hasMore,
    );
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(commentId) || !Types.ObjectId.isValid(userId)) {
      throw new CustomError(
        "Invalid comment or user ID",
        StatusCode.BAD_REQUEST,
      );
    }

    const comment = await this._resourceCommentRepository.findById(commentId);

    if (!comment) {
      throw new CustomError("Comment not found", StatusCode.NOT_FOUND);
    }

    if (comment.userId.toString() !== userId) {
      throw new CustomError(
        "You are not allowed to delete this comment",
        StatusCode.FORBIDDEN,
      );
    }

    const deleted =
      await this._resourceCommentRepository.deleteByResourceAndUser(
        commentId,
        userId,
      );

    if (!deleted) {
      throw new CustomError(
        "Failed to delete comment",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    const updatedCount = await this._resourceRepository.decrementCommentCount(
      comment.resourceId.toString(),
    );

    if (updatedCount === 0) {
      throw new CustomError(
        "Failed to update resource comment count",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
