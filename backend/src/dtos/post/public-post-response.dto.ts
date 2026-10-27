import { PostMediaType } from "../../types/common/post-media.type";

export class PublicPostResponseDTO {
  _id: string;
  content?: string;
  media?: {
    url: string;
    type: PostMediaType;
  };
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isLikedByMe: boolean;
  isViewedByMe: boolean;
  createdAt: Date;
  author: {
    authorId: string;
    name: string;
    profileImage?: string;
  };

  constructor(data: PublicPostResponseDTO) {
    this._id = data._id;
    this.content = data.content;
    this.media = data.media;
    this.viewCount = data.viewCount;
    this.likeCount = data.likeCount;
    this.commentCount = data.commentCount;
    this.isLikedByMe = data.isLikedByMe;
    this.isViewedByMe = data.isViewedByMe;
    this.createdAt = data.createdAt;
    this.author = data.author;
  }
}
