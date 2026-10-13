export interface IPostLikeService {
  likePost(
    postId: string,
    userId: string,
  ): Promise<{ isLiked: boolean; likeCount: number }>;

  unlikePost(
    postId: string,
    userId: string,
  ): Promise<{ isLiked: boolean; likeCount: number }>;

  hasLikedPost(postId: string, userId: string): Promise<boolean>;
}
