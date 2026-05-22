import { Schema, model, Types } from "mongoose";

export interface IPost {
  authorId: Types.ObjectId;

  title?: string;
  content: string;

  mediaUrls: string[];

  likes: Types.ObjectId[];

  commentCount: number;

  isPinned: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

const postSchema = new Schema<IPost>(
  {
  

    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    mediaUrls: {
      type: [String],
      default: [],
    },

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    commentCount: {
      type: Number,
      default: 0,
    },

    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);



export const PostModel = model<IPost>("Post", postSchema);