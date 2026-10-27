import type { IPostCommentResponse } from "../../types/post/post-comment-response.type";
import type { PostCommentResponseDto } from "../../dtos/post/post-comment-response.dto";

export class PostCommentMapper {
  static toResponseDto(comment: IPostCommentResponse): PostCommentResponseDto {
    return {
      id: comment._id,
      postId: comment.postId,
      username: comment.username,
      profileImage: comment.profileImage,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
