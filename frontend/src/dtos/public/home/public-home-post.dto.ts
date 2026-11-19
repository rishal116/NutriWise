
export class PublicHomePostDTO {
  id!: string;
  content?: string;

  media?: {
    url: string;
    type: string;
  };

  viewCount!: number;
  likeCount!: number;
  commentCount!: number;
  createdAt!: string;

  author!: {
    fullName: string;
    username: string;
    profileImage?: string;
  };
}
