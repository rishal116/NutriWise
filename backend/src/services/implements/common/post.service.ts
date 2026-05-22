import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";

import { IPostService } from "../../interfaces/common/IPostService";
import { IPostRepository } from "../../../repositories/interfaces/common/IPostRepository";

import { CreatePostDTO } from "../../../dtos/post/create-post.dto";
import { PostMapper } from "../../../mapper/post/post.mapper";
import { IPost } from "../../../models/post.model";

@injectable()
export class PostService implements IPostService {
  constructor(
    @inject(TYPES.IPostRepository)
    private _postRepo: IPostRepository,
  ) {}

  async createPost(dto: CreatePostDTO): Promise<IPost> {
    const postData = PostMapper.toDomain(dto);

    if (!postData.authorId || !postData.content) {
      throw new Error("Missing required fields");
    }

    return await this._postRepo.create(postData);
  }

  async getPostById(postId: string): Promise<IPost | null> {
    const post = await this._postRepo.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    return post;
  }

  async getAllPosts(page: number, limit: number) {
    return await this._postRepo.findAllPosts(page, limit);
  }

  async getMyPosts(userId: string, page: number, limit: number) {
    return await this._postRepo.findByAuthor(userId, page, limit);
  }



  async updatePost(postId: string, data: Partial<IPost>) {
    const updated = await this._postRepo.updateById(postId, data);

    if (!updated) {
      throw new Error("Post not found");
    }

    return updated;
  }

  async deletePost(postId: string): Promise<boolean> {
    const deleted = await this._postRepo.deleteById(postId);

    if (!deleted) {
      throw new Error("Post not found");
    }

    return deleted > 0;
  }

  async toggleLike(postId: string, userId: string): Promise<void> {
    const post = await this._postRepo.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    const isLiked = post.likes?.includes(userId as any);

    if (isLiked) {
      await this._postRepo.updateById(postId, {
        $pull: { likes: userId },
      } as any);
    } else {
      await this._postRepo.updateById(postId, {
        $addToSet: { likes: userId },
      } as any);
    }
  }
}