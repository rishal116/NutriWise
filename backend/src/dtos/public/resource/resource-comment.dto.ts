export interface ResourceCommentDTO {
  commentId: string;
  userId: string;
  userFullName: string;
  userProfileImage: string | null;
  content: string;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}
