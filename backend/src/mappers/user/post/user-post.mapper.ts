import { PostCardResponseDTO } from "../../../dtos/user/post/post-response.dto";
import { IUserPost } from "../../../types/user/post/user-post.type";

export class UserPostMapper {
  static toResponse(post: IUserPost): PostCardResponseDTO {
    return {
      _id: post._id,
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
      isLikedByMe: post.isLikedByMe,
      isViewedByMe: post.isViewedByMe,
      createdAt: post.createdAt,
    };
  }
}
