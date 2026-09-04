import { Types } from "mongoose";

import { CreatePostDTO } from "../../../dtos/user/post/create-post.dto";
import { UpdatePostDTO } from "../../../dtos/user/post/update-post.dto";
import { PostListQueryDTO } from "../../../dtos/user/post/post-list-query.dto";

import {
  PostCardResponseDTO,
  PostDetailsResponseDTO,
} from "../../../dtos/user/post/post-response.dto";

import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

export interface IUserPostService {
  createPost(
    userId: string | Types.ObjectId,
    data: CreatePostDTO,
    file?: Express.Multer.File,
  ): Promise<PostDetailsResponseDTO>;

  browseMyPosts(
    userId: string | Types.ObjectId,
    query: PostListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<PostCardResponseDTO>>;

  findMyPostDetails(
    userId: string | Types.ObjectId,
    postId: string | Types.ObjectId,
  ): Promise<PostDetailsResponseDTO>;

  updatePost(
    userId: string | Types.ObjectId,
    postId: string | Types.ObjectId,
    data: UpdatePostDTO,
    file?: Express.Multer.File,
  ): Promise<PostDetailsResponseDTO>;

  deletePost(
    userId: string | Types.ObjectId,
    postId: string | Types.ObjectId,
  ): Promise<void>;
}
