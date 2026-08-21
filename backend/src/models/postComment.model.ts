import { model, Schema, Types } from "mongoose";

export interface IPostComment {
  postId: Types.ObjectId;
  userId: Types.ObjectId;

  content: string;

  createdAt: Date;
  updatedAt: Date;
}

const postCommentSchema = new Schema<IPostComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
  },
);

postCommentSchema.index({
  postId: 1,
  createdAt: -1,
});

postCommentSchema.index({
  userId: 1,
  createdAt: -1,
});

export const PostCommentModel = model<IPostComment>(
  "PostComment",
  postCommentSchema,
);
