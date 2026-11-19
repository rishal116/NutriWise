
export class PublicHomeResourceDTO {
  id!: string;
  title!: string;
  description!: string;
  type!: string;
  category!: string;
  fileUrl?: string;
  publishedAt?: string;
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
