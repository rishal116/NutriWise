import { Schema, model, Types } from "mongoose";

export interface IComment {
  postId: Types.ObjectId;
  authorId: Types.ObjectId;

  content: string;

  parentId: Types.ObjectId | null;

  likes: Types.ObjectId[];

  isDeleted: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

const commentSchema = new Schema<IComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },

    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
    },

    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      index: true,
    },

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// top-level comments
commentSchema.index({ postId: 1, createdAt: -1 });

// replies
commentSchema.index({ parentId: 1, createdAt: 1 });

export const CommentModel = model<IComment>(
  "Comment",
  commentSchema
);