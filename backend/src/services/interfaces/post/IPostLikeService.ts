export interface IPostLikeService {
  likePost(postId: string, userId: string): Promise<void>;

  unlikePost(postId: string, userId: string): Promise<void>;
}