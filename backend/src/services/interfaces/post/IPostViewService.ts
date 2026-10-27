export interface IPostViewService {
  viewPost(postId: string, userId: string): Promise<void>;
}