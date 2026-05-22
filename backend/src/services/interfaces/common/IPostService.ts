import { IPost } from "../../../models/post.model";
import { CreatePostDTO } from "../../../dtos/post/create-post.dto";

export interface IPostService {
  createPost(dto: CreatePostDTO): Promise<IPost>;

  getPostById(postId: string): Promise<IPost | null>;

  getAllPosts(page: number, limit: number): Promise<IPost[]>;

  getMyPosts(userId: string, page: number, limit: number): Promise<IPost[]>;

  updatePost(postId: string, data: Partial<IPost>): Promise<IPost | null>;

  deletePost(postId: string): Promise<boolean>;

  toggleLike(postId: string, userId: string): Promise<void>;
}