import { Schema, model, Types } from "mongoose";

import {
  SPECIALIZATIONS,
  type Specialization,
} from "../constants/nutritionist/profile/specialization.constants";

import {
  LANGUAGES,
  type Language,
} from "../constants/nutritionist/profile/language.constants";

import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
} from "../constants/nutritionist/profile/application.constants";

import {
  AVAILABILITY_STATUSES,
  type AvailabilityStatus,
} from "../constants/nutritionist/profile/availability.constants";

import {
  COACH_LEVELS,
  type CoachLevel,
} from "../constants/nutritionist/profile/coach-level.constants";

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

export interface INutritionistProfile {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  qualifications: IQualification[];
  specializations: Specialization[];
  experiences: IExperience[];
  bio?: string;
  languages: Language[];
  resumeUrl: string;
  certifications: ICertification[];
  applicationStatus: ApplicationStatus;
  rejectionReason?: string;
  availabilityStatus: AvailabilityStatus;
  coachLevel: CoachLevel;
  rating: number;
  totalReviews: number;
  totalPeopleCoached: number;
  createdAt: Date;
  updatedAt: Date;
}

const QualificationSchema = new Schema<IQualification>(
  {
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    institution: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear(),
      validate: {
        validator: Number.isInteger,
        message: "Qualification year must be a whole number.",
      },
    },
  },
  { _id: false },
);

const ExperienceSchema = new Schema<IExperience>(
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
    durationYears: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const CertificationSchema = new Schema<ICertification>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    issuedBy: {
      type: String,
      required: true,
      trim: true,
    },
    certificateUrl: {
      type: String,
      required: true,
      trim: true,
    },
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
      immutable: true,
    },

    qualifications: {
      type: [QualificationSchema],
      required: true,
      validate: {
        validator: (value: IQualification[]) => value.length > 0,
        message: "At least one qualification is required.",
      },
    },

    specializations: {
      type: [String],
      enum: SPECIALIZATIONS,
      required: true,
      validate: {
        validator: (value: Specialization[]) => value.length > 0,
        message: "At least one specialization is required.",
      },
    },

    experiences: {
      type: [ExperienceSchema],
      required: true,
      validate: {
        validator: (value: IExperience[]) => value.length > 0,
        message: "At least one experience is required.",
      },
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
      validate: {
        validator: (value: Language[]) => value.length > 0,
        message: "At least one language is required.",
      },
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

    applicationStatus: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: "pending",
      required: true,
    },

    rejectionReason: {
      type: String,
      trim: true,
    },

    availabilityStatus: {
      type: String,
      enum: AVAILABILITY_STATUSES,
      default: "available",
      required: true,
    },

    coachLevel: {
      type: String,
      enum: COACH_LEVELS,
      default: "beginner",
      required: true,
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
  { timestamps: true },
);

NutritionistProfileSchema.index({
  applicationStatus: 1,
  createdAt: -1,
});

NutritionistProfileSchema.index({
  applicationStatus: 1,
  rating: -1,
});

NutritionistProfileSchema.index({
  applicationStatus: 1,
  coachLevel: 1,
});

export const NutritionistProfileModel = model<INutritionistProfile>(
  "NutritionistProfile",
  NutritionistProfileSchema,
);
