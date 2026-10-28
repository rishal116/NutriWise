import type { IAdminPost } from "../../../types/admin/post/post.types";
import type { AdminPostResponseDTO } from "../../../dtos/admin/post/admin-post-response.dto";

export class AdminPostMapper {
  static toResponseDTO(post: IAdminPost): AdminPostResponseDTO {
    return {
      id: post._id.toString(),
      author: {
        id: post.authorId._id.toString(),
        fullName: post.authorId.fullName,
        profileImage: post.authorId.profileImage,
      },
      content: post.content,
      media: post.media
        ? {
            url: post.media.url,
            type: post.media.type,
          }
        : undefined,
      viewCount: post.viewCount,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}
