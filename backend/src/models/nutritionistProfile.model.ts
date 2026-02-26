import { Schema, model, Document, Types } from "mongoose";

export interface IExperience {
  role: string;
  organization: string;
  years: number;
}

export interface INutritionistProfile extends Document {
  _id:Types.ObjectId,
  userId: Types.ObjectId;
  qualifications: string[];
  specializations: string[];
  experiences: IExperience[];
  bio?: string;
  languages: string[];
  availabilityStatus: "available" | "unavailable" | "busy";
  cv?: string;
  certifications?: string[];
  totalExperienceYears?: number;
  coachLevel: "BEGINNER" | "VERIFIED" | "EXPERT" | "TOP_COACH";
  totalPeopleCoached?:number;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperience>({
  role: { type: String, required: true, trim: true },
  organization: { type: String, required: true, trim: true },
  years: { type: Number, required: true, min: [1, "Experience years must be greater than 0"] },
},
{ _id: false });

const NutritionistDetailsSchema = new Schema<INutritionistProfile>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  qualifications: {
    type: [String],
    required: [true, "At least one qualification is required"],
  },
  specializations: {
    type: [String],
    required: [true, "At least one specialization is required"],
  },
  experiences: {
    type: [ExperienceSchema],
    required: [true, "Experience details are required"],
    validate: [
      (val: IExperience[]) => val.length > 0,
      "At least one experience is required",
    ]},
    bio: { type: String, trim: true, maxlength: [500, "Bio cannot exceed 500 characters"] },
    languages: {
      type: [String],
      required: [true, "At least one language is required"],
    },
    availabilityStatus: {
      type: String,
      enum: ["available", "unavailable", "busy"],
      default: "available",
    },
    cv: { type: String },
    certifications: { type: [String] }, 
    totalExperienceYears: { type: Number, min: 0 },
    coachLevel: {
      type: String,
      enum: ["BEGINNER", "VERIFIED", "EXPERT", "TOP_COACH"],
      default: "BEGINNER",
      index: true
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true, collection: "NutritionistProfile" }
);

export const NutritionistDetailsModel = model<INutritionistProfile>(
  "NutritionistProfile",
  NutritionistDetailsSchema
);
