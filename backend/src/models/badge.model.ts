// badge.model.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBadge extends Document {
  _id: Types.ObjectId;

  title: string;
  slug: string;

  description?: string;

  icon?: string;
  image?: string;

  category:
    | "streak"
    | "completion"
    | "performance"
    | "milestone"
    | "special";

  rarity: "common" | "rare" | "epic" | "legendary";

  rewardPoints: number;

  unlockCondition: {
    type: string;
    value: number;
  };

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const BadgeSchema = new Schema<IBadge>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },

    description: String,

    icon: String,
    image: String,

    category: {
      type: String,
      enum: ["streak", "completion", "performance", "milestone", "special"],
      required: true,
    },

    rarity: {
      type: String,
      enum: ["common", "rare", "epic", "legendary"],
      default: "common",
    },

    rewardPoints: {
      type: Number,
      default: 0,
    },

    unlockCondition: {
      type: {
        type: String,
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

BadgeSchema.index({ slug: 1 }, { unique: true });

export default mongoose.model<IBadge>("Badge", BadgeSchema);