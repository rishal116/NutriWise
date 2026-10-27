import { inject, injectable } from "inversify";
import { Types } from "mongoose";
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

  async likePost(postId: string, userId: string): Promise<void> {
    this.validateIds(postId, userId);

    const postObjectId = new Types.ObjectId(postId);
    const userObjectId = new Types.ObjectId(userId);

    const post = await this.postRepository.findById(postObjectId);

    if (!post) {
      throw new CustomError("Post not found", StatusCode.NOT_FOUND);
    }

    const existingLike = await this.postLikeRepository.findByPostAndUser(
      postObjectId,
      userObjectId,
    );

    if (existingLike) {
      return;
    }

    await this.postLikeRepository.create({
      postId: postObjectId,
      userId: userObjectId,
    });

    await this.postRepository.updateOne(
      { _id: postObjectId },
      { $inc: { likeCount: 1 } },
    );
  }

  async unlikePost(postId: string, userId: string): Promise<void> {
    this.validateIds(postId, userId);

    const postObjectId = new Types.ObjectId(postId);
    const userObjectId = new Types.ObjectId(userId);

    const post = await this.postRepository.findById(postObjectId);

    if (!post) {
      throw new CustomError("Post not found", StatusCode.NOT_FOUND);
    }

    const deleted = await this.postLikeRepository.deleteOne({
      postId: postObjectId,
      userId: userObjectId,
    });

    if (deleted > 0) {
      await this.postRepository.updateOne(
        { _id: postObjectId, likeCount: { $gt: 0 } },
        { $inc: { likeCount: -1 } },
      );
    }
  }

  private validateIds(postId: string, userId: string): void {
    if (!Types.ObjectId.isValid(postId) || !Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid post or user ID", StatusCode.BAD_REQUEST);
    }
  }
}
