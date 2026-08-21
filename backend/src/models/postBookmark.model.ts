import { model, Schema, Types } from "mongoose";

export interface IPostBookmark {
  postId: Types.ObjectId;
  userId: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const postBookmarkSchema = new Schema<IPostBookmark>(
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
  },
  {
    timestamps: true,
  },
);

postBookmarkSchema.index(
  {
    postId: 1,
    userId: 1,
  },
  {
    unique: true,
  },
);

postBookmarkSchema.index({
  userId: 1,
  createdAt: -1,
});

export const PostBookmarkModel = model<IPostBookmark>(
  "PostBookmark",
  postBookmarkSchema,
);
