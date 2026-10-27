import { Types } from "mongoose";

export interface IResourceCommentUserProjection {
  _id: Types.ObjectId;
  fullName: string;
  profileImage?: string | null;
}

export interface IResourceCommentProjection {
  _id: Types.ObjectId;
  resourceId: Types.ObjectId;
  userId: IResourceCommentUserProjection;
  content: string;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}