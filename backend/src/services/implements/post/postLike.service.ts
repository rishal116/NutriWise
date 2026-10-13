import { inject, injectable } from "inversify";
import mongoose, { Types } from "mongoose";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { TYPES } from "../../../types/types";
import { IPostLikeService } from "../../interfaces/post/IPostLikeService";
import { IPostLikeRepository } from "../../../repositories/interfaces/post/IPostLikeRepository";
import { IPostRepository } from "../../../repositories/interfaces/post/IPostRepository";

@injectable()
export class PostLikeService implements IPostLikeService {
  constructor(
    @inject(TYPES.IPostLikeRepository)
    private readonly postLikeRepository: IPostLikeRepository,

    @inject(TYPES.IPostRepository)
    private readonly postRepository: IPostRepository,
  ) {}

  async likePost(
    postId: string,
    userId: string,
  ): Promise<{ isLiked: boolean; likeCount: number }> {
    this.validateIds(postId, userId);

    const postObjectId = new Types.ObjectId(postId);
    const userObjectId = new Types.ObjectId(userId);
    const session = await mongoose.startSession();

    try {
      let likeCount = 0;

      await session.withTransaction(async () => {
        const post = await this.postRepository.findById(postObjectId);

        if (!post) {
          throw new CustomError("Post not found", StatusCode.NOT_FOUND);
        }

        const existingLike = await this.postLikeRepository.findByPostAndUser(
          postObjectId,
          userObjectId,
        );

        if (existingLike) {
          likeCount = post.likeCount;
          return;
        }

        await this.postLikeRepository.createWithSession(
          { postId: postObjectId, userId: userObjectId },
          session,
        );

        await this.postRepository.updateOne(
          { _id: postObjectId },
          { $inc: { likeCount: 1 } },
        );

        likeCount = post.likeCount + 1;
      });

      return { isLiked: true, likeCount };
    } finally {
      await session.endSession();
    }
  }

  async unlikePost(
    postId: string,
    userId: string,
  ): Promise<{ isLiked: boolean; likeCount: number }> {
    this.validateIds(postId, userId);

    const postObjectId = new Types.ObjectId(postId);
    const userObjectId = new Types.ObjectId(userId);
    const session = await mongoose.startSession();

    try {
      let likeCount = 0;

      await session.withTransaction(async () => {
        const post = await this.postRepository.findById(postObjectId);

        if (!post) {
          throw new CustomError("Post not found", StatusCode.NOT_FOUND);
        }

        const deleted = await this.postLikeRepository.deleteByPostAndUser(
          postObjectId,
          userObjectId,
          session,
        );

        if (deleted) {
          await this.postRepository.updateOne(
            { _id: postObjectId, likeCount: { $gt: 0 } },
            { $inc: { likeCount: -1 } },
          );
        }

        likeCount = deleted ? Math.max(0, post.likeCount - 1) : post.likeCount;
      });

      return { isLiked: false, likeCount };
    } finally {
      await session.endSession();
    }
  }

  async hasLikedPost(postId: string, userId: string): Promise<boolean> {
    this.validateIds(postId, userId);

    const like = await this.postLikeRepository.findByPostAndUser(
      new Types.ObjectId(postId),
      new Types.ObjectId(userId),
    );

    return like !== null;
  }

  private validateIds(postId: string, userId: string): void {
    if (!Types.ObjectId.isValid(postId) || !Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid post or user ID", StatusCode.BAD_REQUEST);
    }
  }
}
