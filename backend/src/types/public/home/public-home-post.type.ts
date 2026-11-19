export interface PublicHomePost {
  id: string;
  content?: string;
  media?: {
    url: string;
    type: string;
  };
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
