export interface PublicHomeResource {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  fileUrl?: string;
  publishedAt?: Date;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  author: {
    fullName: string;
    username: string;
    profileImage?: string;
  };
}