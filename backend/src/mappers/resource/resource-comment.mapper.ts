import { ResourceCommentDTO } from "../../dtos/public/resource/resource-comment.dto";
import { IResourceCommentProjection } from "../../types/resource/resource-comment.projection";

export class ResourceCommentMapper {
  static toDTO(comment: IResourceCommentProjection): ResourceCommentDTO {
    return {
      commentId: comment._id.toString(),
      userId: comment.userId._id.toString(),
      userFullName: comment.userId.fullName,
      userProfileImage: comment.userId.profileImage ?? null,
      content: comment.content,
      isEdited: comment.isEdited,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
