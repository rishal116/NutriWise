import { Schema, Types, model } from "mongoose";

export enum MeasurementUnit {
  KG = "kg",
  CM = "cm",
  PERCENT = "%",
  ML = "ml",
}

export interface IUserMeasurement {
  _id: Types.ObjectId;
  name: string;
  value: number;
  unit: MeasurementUnit;
}

export interface IUserWeeklyCheckIn {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  userProgramId: Types.ObjectId;
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  measurements: IUserMeasurement[];
  progressPhotos: string[];
  overallRating?: number;
  achievements: string[];
  challenges: string[];
  userNotes?: string | null;
  nutritionistFeedback?: string | null;
  nextWeekFocus?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const MeasurementSchema = new Schema<IUserMeasurement>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },

  value: {
    type: Number,
    required: true,
    min: 0,
  },

  unit: {
    type: String,
    enum: Object.values(MeasurementUnit),
    required: true,
  },
});

const UserWeeklyCheckInSchema = new Schema<IUserWeeklyCheckIn>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userProgramId: {
      type: Schema.Types.ObjectId,
      ref: "UserProgram",
      required: true,
    },

    weekNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
      validate: {
        validator(this: IUserWeeklyCheckIn, value: Date) {
          return value >= this.startDate;
        },
        message: "End date must be greater than or equal to start date.",
      },
    },

    measurements: {
      type: [MeasurementSchema],
      default: [],
    },

    progressPhotos: {
      type: [String],
      default: [],
      validate: {
        validator: (photos: string[]) => photos.length <= 10,
        message: "Maximum 10 progress photos are allowed.",
      },
    },

    overallRating: {
      type: Number,
      min: 1,
      max: 5,
    },

    achievements: {
      type: [String],
      default: [],
    },

    challenges: {
      type: [String],
      default: [],
    },

    userNotes: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: null,
    },

    nutritionistFeedback: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: null,
    },

    nextWeekFocus: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

UserWeeklyCheckInSchema.index(
  { userProgramId: 1, weekNumber: 1 },
  { unique: true },
);

UserWeeklyCheckInSchema.index({ userId: 1, startDate: -1 });

export const UserWeeklyCheckInModel = model<IUserWeeklyCheckIn>(
  "UserWeeklyCheckIn",
  UserWeeklyCheckInSchema,
);
