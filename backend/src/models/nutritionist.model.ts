import { Schema, model, Document } from "mongoose";

export interface INutritionist extends Document {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  qualification: string;
  specialization: string;
  experienceYears: number;
  bio?: string;
  languages: string;
  videoCallRate: number;
  consultationDuration: string;
  availabilityStatus: "available" | "unavailable" | "busy";
  profileImage?: string;
  status: "pending" | "approved" | "rejected";
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const nutritionistSchema = new Schema<INutritionist>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    qualification: {
      type: String,
      required: [true, "Qualification is required"],
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
    },
    experienceYears: {
      type: Number,
      required: [true, "Experience in years is required"],
      min: [0, "Experience cannot be negative"],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    languages: {
      type: String,
      required: [true, "Languages field is required"],
    },
    videoCallRate: {
      type: Number,
      required: [true, "Video call rate is required"],
      min: [0, "Rate must be positive"],
    },
    consultationDuration: {
      type: String,
      required: [true, "Consultation duration is required"],
    },
    availabilityStatus: {
      type: String,
      enum: ["available", "unavailable", "busy"],
      default: "available",
    },
    profileImage: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "nutritionists" }
);

export const NutritionistModel = model<INutritionist>(
  "Nutritionist",
  nutritionistSchema
);
