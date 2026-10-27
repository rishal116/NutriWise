import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../../types/types";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { IPostCommentRepository } from "../../../repositories/interfaces/post/IPostCommentRepository";
import { IPostRepository } from "../../../repositories/interfaces/post/IPostRepository";
import { IPostCommentService } from "../../interfaces/post/IPostCommentService";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { PostCommentResponseDto } from "../../../dtos/post/post-comment-response.dto";
import { PostCommentMapper } from "../../../mappers/post/post-comment.mapper";

@injectable()
export class PostCommentService implements IPostCommentService {
  constructor(
    @inject(TYPES.IPostCommentRepository)
    private readonly _postCommentRepository: IPostCommentRepository,

    @inject(TYPES.IPostRepository)
    private readonly _postRepository: IPostRepository,
  ) {}

  async createComment(
    postId: string,
    userId: string,
    content: string,
  ): Promise<void> {
    if (!Types.ObjectId.isValid(postId) || !Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid post or user ID", StatusCode.BAD_REQUEST);
    }

    const trimmedContent = content.trim();

    if (!trimmedContent || trimmedContent.length > 2000) {
      throw new CustomError(
        "Comment must contain between 1 and 2000 characters",
        StatusCode.BAD_REQUEST,
      );
    }

    const post = await this._postRepository.findById(postId);

    if (!post) {
      throw new CustomError("Post not found", StatusCode.NOT_FOUND);
    }

    await this._postCommentRepository.create({
      postId: new Types.ObjectId(postId),
      userId: new Types.ObjectId(userId),
      content: trimmedContent,
    });

    const updatedCount =
      await this._postRepository.incrementCommentCount(postId);

    if (updatedCount === 0) {
      throw new CustomError(
        "Failed to update comment count",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getComments(
    postId: string,
    limit = 10,
    cursor?: string,
  ): Promise<InfiniteScrollResponseDTO<PostCommentResponseDto>> {
    if (!Types.ObjectId.isValid(postId)) {
      throw new CustomError("Invalid post ID", StatusCode.BAD_REQUEST);
    }

    const post = await this._postRepository.findById(postId);

    if (!post) {
      throw new CustomError("Post not found", StatusCode.NOT_FOUND);
    }

    const safeLimit = Number.isFinite(limit)
      ? Math.min(Math.max(Math.floor(limit), 1), 50)
      : 10;

    const result = await this._postCommentRepository.findByPostId(
      new Types.ObjectId(postId),
      safeLimit,
      cursor,
    );

    return new InfiniteScrollResponseDTO(
      result.items.map(PostCommentMapper.toResponseDto),
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

    const comment = await this._postCommentRepository.findById(commentId);

    if (!comment) {
      throw new CustomError("Comment not found", StatusCode.NOT_FOUND);
    }

    if (comment.userId.toString() !== userId) {
      throw new CustomError(
        "You are not allowed to delete this comment",
        StatusCode.FORBIDDEN,
      );
    }

    const deleted = await this._postCommentRepository.deleteOne(
      new Types.ObjectId(commentId),
    );

    if (!deleted) {
      throw new CustomError(
        "Failed to delete comment",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    const updatedCount = await this._postRepository.decrementCommentCount(
      comment.postId.toString(),
    );

    if (updatedCount === 0) {
      throw new CustomError(
        "Failed to update comment count",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
