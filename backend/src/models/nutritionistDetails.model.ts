import { Schema, model, Document, Types } from "mongoose";

export interface IExperience {
  role: string;
  organization: string;
  years: number;
}

export interface INutritionistDetails extends Document {
  userId: Types.ObjectId;
  profileImage?: string; // Profile image for nutritionist
  qualifications: string[];
  specializations: string[];
  experiences: IExperience[];
  bio?: string;
  languages: string[];
  videoCallRate: number;
  consultationDuration: string;
  availabilityStatus: "available" | "unavailable" | "busy";
  cv?: string;
  certifications?: string[];
  totalExperienceYears?: number;
  location?: {
    state: string;
    city: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    role: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    years: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const NutritionistDetailsSchema = new Schema<INutritionistDetails>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    profileImage: { type: String }, // Added profile image

    qualifications: { type: [String], required: [true, "At least one qualification is required"], trim: true },
    specializations: { type: [String], required: [true, "At least one specialization is required"], trim: true },
    experiences: {
      type: [ExperienceSchema],
      required: [true, "Experience details are required"],
      validate: [(val: IExperience[]) => val.every(exp => exp.years > 0), "Experience years must be greater than 0"]
    },
    bio: { type: String, trim: true, maxlength: [500, "Bio cannot exceed 500 characters"] },
    languages: { type: [String], required: [true, "At least one language is required"] },
    videoCallRate: { type: Number, required: [true, "Video call rate is required"], min: [0, "Rate must be positive"] },
    consultationDuration: { type: String, required: [true, "Consultation duration is required"], trim: true },
    availabilityStatus: { type: String, enum: ["available", "unavailable", "busy"], default: "available" },
    cv: { type: String },
    certifications: { type: [String] },
    totalExperienceYears: { type: Number, min: 0 },
    location: {
      state: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
    },
  },
  { timestamps: true, collection: "NutritionistDetails" }
);

export const NutritionistDetailsModel = model<INutritionistDetails>(
  "NutritionistDetails",
  NutritionistDetailsSchema
);
