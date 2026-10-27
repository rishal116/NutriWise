export interface IUserPostComment {
  _id: string;
  userId: string;
  username: string;
  fullName: string;
  profilePicture?: string;
  content: string;
  createdAt: Date;
}
