import { PublicPostListItemDTO } from "../../../dtos/public/post/public-post-list-item.dto";
import { IPublicPostListItemProjection } from "../../../types/public/post/public-post-list-item.projection";
import { IPublicPostDetailsProjection } from "../../../types/public/post/public-post-details.projection";

export class PublicPostMapper {
  static toListItem(
    post: IPublicPostListItemProjection,
  ): PublicPostListItemDTO {
    return {
      postId: post.postId,
      ...(post.content !== undefined && { content: post.content }),
      ...(post.media && {
        media: {
          url: post.media.url,
          type: post.media.type,
        },
      }),
      likeCount: post.likeCount,
      isLiked: post.isLiked,
      commentCount: post.commentCount,
      bookmarkCount: post.bookmarkCount,
      author: {
        authorId: post.author.authorId,
        name: post.author.name,
        ...(post.author.profileImage !== undefined && {
          profileImage: post.author.profileImage,
        }),
      },
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  static toDetails(post: IPublicPostDetailsProjection): PublicPostListItemDTO {
    return this.toListItem(post);
  }
}
