export interface PostCommentResponseDto {
  id: string;
  postId: string;
  username: string;
  profileImage?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

