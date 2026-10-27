import { model, Schema, Types } from "mongoose";

export interface IPostView {
  _id: Types.ObjectId;
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const postViewSchema = new Schema<IPostView>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

postViewSchema.index({ postId: 1, userId: 1 }, { unique: true });

postViewSchema.index({ userId: 1, createdAt: -1 });

export const PostViewModel = model<IPostView>("PostView", postViewSchema);
