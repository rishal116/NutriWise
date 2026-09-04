import { model, Schema, Types } from "mongoose";

export interface IPostLike {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const postLikeSchema = new Schema<IPostLike>(
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

postLikeSchema.index(
  {
    postId: 1,
    userId: 1,
  },
  {
    unique: true,
  },
);

postLikeSchema.index({
  userId: 1,
  createdAt: -1,
});

export const PostLikeModel = model<IPostLike>("PostLike", postLikeSchema);
