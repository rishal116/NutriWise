import { model, Schema, Types } from "mongoose";

export interface IPost {
  authorId: Types.ObjectId;

  content: string;

  imageUrls: string[];

  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
  shareCount: number;

  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    imageUrls: {
      type: [String],
      default: [],
    },

    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    commentCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    bookmarkCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    shareCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

postSchema.index({
  authorId: 1,
  createdAt: -1,
});

postSchema.index({
  createdAt: -1,
});

export const PostModel = model<IPost>("Post", postSchema);
