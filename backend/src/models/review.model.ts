import mongoose, { Schema, Document, Types } from "mongoose";

export interface IReview extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  nutritionist: Types.ObjectId;
  userPlan: Types.ObjectId;
  rating: number;
  review?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    nutritionist: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    userPlan: {
      type: Schema.Types.ObjectId,
      ref: "UserPlan",
      required: true,
      unique: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    review: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// 🔥 Useful index
reviewSchema.index({ nutritionist: 1, createdAt: -1 });

export const Review = mongoose.model<IReview>("Review", reviewSchema);
