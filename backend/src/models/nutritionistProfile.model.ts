import { Schema, model, Document, Types } from "mongoose";

export interface IExperience {
  role: string;
  organization: string;
  years: number;
}

export type VerificationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "none";

export interface INutritionistProfile extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;

  qualifications: string[];
  specializations: string[];
  experiences: IExperience[];

  bio?: string;
  languages: string[];

  availabilityStatus: "available" | "unavailable" | "busy";

  cv?: string;
  certifications?: string[];

  coachLevel: "BEGINNER" | "VERIFIED" | "EXPERT" | "TOP_COACH";

  totalPeopleCoached?: number;
  rating?: number;

  verificationStatus: VerificationStatus;
  rejectionReason?: string;

  profileCompleted: boolean;
  profileCompletionPercentage?: number;

  createdAt: Date;
  updatedAt: Date;
}

const experienceSchema = new Schema<IExperience>(
  {
    role: {
      type: String,
      required: true,
      trim: true,
    },
    organization: {
      type: String,
      required: true,
      trim: true,
    },
    years: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  }
);

const nutritionistProfileSchema = new Schema<INutritionistProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    qualifications: {
      type: [String],
      required: true,
    },
    specializations: {
      type: [String],
      required: true,
      index: true,
    },
    experiences: {
      type: [experienceSchema],
      required: true,
      validate: [(val: IExperience[]) => val.length > 0, "At least one experience is required"],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    languages: {
      type: [String],
      required: true,
    },
    availabilityStatus: {
      type: String,
      enum: ["available", "unavailable", "busy"],
      default: "available",
    },
    cv: {
      type: String,
    },
    certifications: {
      type: [String],
    },
    coachLevel: {
      type: String,
      enum: ["BEGINNER", "VERIFIED", "EXPERT", "TOP_COACH"],
      default: "BEGINNER",
      index: true,
    },
    totalPeopleCoached: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "none"],
      default: "none",
      index: true,
    },
    rejectionReason: {
      type: String,
      trim: true,
      default: "",
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    profileCompletionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
    collection: "NutritionistProfile",
  }
);

export const NutritionistProfileModel = model<INutritionistProfile>(
  "NutritionistProfile",
  nutritionistProfileSchema
);
