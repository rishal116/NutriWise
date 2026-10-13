import { inject, injectable } from "inversify";
import mongoose, { Types } from "mongoose";
import { TYPES } from "../../../types/types";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { IPostCommentRepository } from "../../../repositories/interfaces/post/IPostCommentRepository";
import { IPostRepository } from "../../../repositories/interfaces/post/IPostRepository";
import { IPostComment } from "../../../models/postComment.model";
import { IPostCommentService } from "../../interfaces/post/IPostCommentService";

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
  ): Promise<IPostComment> {
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

    const session = await mongoose.startSession();

    try {
      let createdComment: IPostComment | null = null;

      await session.withTransaction(async () => {
        const post = await this._postRepository.findById(postId);

        if (!post) {
          throw new CustomError("Post not found", StatusCode.NOT_FOUND);
        }

        createdComment = await this._postCommentRepository.createWithSession(
          {
            postId: new Types.ObjectId(postId),
            userId: new Types.ObjectId(userId),
            content: trimmedContent,
          },
          session,
        );

        const updatedCount = await this._postRepository.incrementCommentCount(
          postId,
          session,
        );

        if (updatedCount === 0) {
          throw new CustomError(
            "Failed to update comment count",
            StatusCode.INTERNAL_SERVER_ERROR,
          );
        }
      });

      if (!createdComment) {
        throw new CustomError(
          "Failed to create comment",
          StatusCode.INTERNAL_SERVER_ERROR,
        );
      }

      return createdComment;
    } finally {
      await session.endSession();
    }
  }

  async getComments(
    postId: string,
    limit = 10,
    cursor?: { createdAt: Date; id: string },
  ): Promise<{
    comments: IPostComment[];
    nextCursor: { createdAt: Date; id: string } | null;
    hasMore: boolean;
  }> {
    if (!Types.ObjectId.isValid(postId)) {
      throw new CustomError("Invalid post ID", StatusCode.BAD_REQUEST);
    }

    const post = await this._postRepository.findById(postId);

    if (!post) {
      throw new CustomError("Post not found", StatusCode.NOT_FOUND);
    }

    const safeLimit = Math.min(Math.max(limit, 1), 50);

    const parsedCursor = cursor
      ? {
          createdAt: new Date(cursor.createdAt),
          id: new Types.ObjectId(cursor.id),
        }
      : undefined;

    const results = await this._postCommentRepository.findByPostId(
      new Types.ObjectId(postId),
      safeLimit + 1,
      parsedCursor,
    );

    const hasMore = results.length > safeLimit;
    const comments = hasMore ? results.slice(0, safeLimit) : results;
    const lastComment = comments[comments.length - 1];

    return {
      comments,
      hasMore,
      nextCursor:
        hasMore && lastComment
          ? {
              createdAt: lastComment.createdAt,
              id: lastComment._id.toString(),
            }
          : null,
    };
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(commentId) || !Types.ObjectId.isValid(userId)) {
      throw new CustomError(
        "Invalid comment or user ID",
        StatusCode.BAD_REQUEST,
      );
    }

    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
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

        const deleted = await this._postCommentRepository.deleteById(
          new Types.ObjectId(commentId),
          session,
        );

        if (!deleted) {
          throw new CustomError(
            "Failed to delete comment",
            StatusCode.INTERNAL_SERVER_ERROR,
          );
        }

        const updatedCount = await this._postRepository.decrementCommentCount(
          comment.postId.toString(),
          session,
        );

        if (updatedCount === 0) {
          throw new CustomError(
            "Failed to update comment count",
            StatusCode.INTERNAL_SERVER_ERROR,
          );
        }
      });
    } finally {
      await session.endSession();
    }
  }
}
