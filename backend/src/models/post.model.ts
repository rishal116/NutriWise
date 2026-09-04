import { model, Schema, Types } from "mongoose";

import { PostMediaType } from "../types/common/post-media.type";

export interface IPostMedia {
  url: string;
  type: PostMediaType;
}

export interface IPost {
  _id: Types.ObjectId;
  authorId: Types.ObjectId;
  content?: string;
  media?: IPostMedia;
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const postMediaSchema = new Schema<IPostMedia>(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(PostMediaType),
      required: true,
    },
  },
  {
    _id: false,
  },
);

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
      trim: true,
      maxlength: 5000,
    },

    media: {
      type: postMediaSchema,
      required: false,
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
