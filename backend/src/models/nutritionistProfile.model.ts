import { Schema, model, Document, Types } from "mongoose";
import {
  APPLICATION_STATUSES,
  AVAILABILITY_STATUSES,
  COACH_LEVELS,
  SPECIALIZATIONS,
  LANGUAGES,
  AvailabilityStatus,
  ApplicationStatus,
  CoachLevel,
  Specialization,
  Language,
} from "../types/nutritionist.types";

export interface IQualification {
  degree: string;
  institution: string;
  year: number;
}

export interface IExperience {
  role: string;
  organization: string;
  durationYears: number;
}

export interface ICertification {
  name: string;
  issuedBy: string;
  certificateUrl: string;
}

export interface INutritionistProfile extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  qualifications: IQualification[];
  specializations: Specialization[];
  experiences: IExperience[];
  bio?: string;
  languages: Language[];
  availabilityStatus: AvailabilityStatus;
  resumeUrl: string;
  certifications: ICertification[];
  totalExperienceYears: number;
  applicationStatus: ApplicationStatus;
  rejectionReason?: string;
  coachLevel: CoachLevel;
  rating: number;
  totalReviews: number;
  totalPeopleCoached: number;
  createdAt: Date;
  updatedAt: Date;
}

const QualificationSchema = new Schema<IQualification>(
  {
    degree: { type: String, required: true, trim: true },
    institution: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
  },
  { _id: false },
);

const ExperienceSchema = new Schema<IExperience>(
  {
    role: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    durationYears: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const CertificationSchema = new Schema<ICertification>(
  {
    name: { type: String, required: true, trim: true },
    issuedBy: { type: String, required: true, trim: true },
    certificateUrl: { type: String, required: true },
  },
  { _id: false },
);

const NutritionistProfileSchema = new Schema<INutritionistProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
      immutable: true,
    },

    qualifications: {
      type: [QualificationSchema],
      required: true,
      validate: [
        (v: IQualification[]) => v.length > 0,
        "At least one qualification is required",
      ],
    },

    specializations: {
      type: [String],
      enum: SPECIALIZATIONS,
      required: true,
      validate: [
        (v: string[]) => v.length > 0,
        "At least one specialization is required",
      ],
    },

    experiences: {
      type: [ExperienceSchema],
      required: true,
      validate: [
        (v: IExperience[]) => v.length > 0,
        "At least one experience is required",
      ],
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    languages: {
      type: [String],
      enum: LANGUAGES,
      required: true,
      validate: [
        (v: string[]) => v.length > 0,
        "At least one language is required",
      ],
    },

    availabilityStatus: {
      type: String,
      enum: AVAILABILITY_STATUSES,
      default: "available",
    },

    resumeUrl: {
      type: String,
      required: true,
      trim: true,
    },

    certifications: {
      type: [CertificationSchema],
      default: [],
    },

    totalExperienceYears: {
      type: Number,
      default: 0,
      min: 0,
    },

    applicationStatus: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: "pending",
    },

    rejectionReason: {
      type: String,
      trim: true,
    },

    coachLevel: {
      type: String,
      enum: COACH_LEVELS,
      default: "beginner",
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalPeopleCoached: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

NutritionistProfileSchema.index({ applicationStatus: 1 });
NutritionistProfileSchema.index({ coachLevel: 1 });
NutritionistProfileSchema.index({ rating: -1 });
NutritionistProfileSchema.index({
  applicationStatus: 1,
  coachLevel: 1,
});

export const NutritionistProfileModel = model<INutritionistProfile>(
  "NutritionistProfile",
  NutritionistProfileSchema,
);
