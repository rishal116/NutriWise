export interface IPostCommentResponse {
  _id: string;
  postId: string;
  username: string;
  profileImage?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
