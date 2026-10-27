import { IPublicPost } from "../../types/post/public-post.type";
import { PublicPostResponseDTO } from "../../dtos/post/public-post-response.dto";

export class PublicPostMapper {
  static toResponse(post: IPublicPost): PublicPostResponseDTO {
    return new PublicPostResponseDTO({
      _id: post._id,
      content: post.content,
      media: post.media,
      viewCount: post.viewCount,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      isLikedByMe: post.isLikedByMe,
      isViewedByMe: post.isViewedByMe,
      createdAt: post.createdAt,
      author: {
        authorId: post.author.authorId,
        name: post.author.name,
        profileImage: post.author.profileImage,
      },
    });
  }
}
