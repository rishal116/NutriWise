export interface ResourceCommentDTO {
  commentId: string;
  userId: string;
  content: string;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}