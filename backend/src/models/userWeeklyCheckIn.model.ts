import { Schema, model, Types } from "mongoose";

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
  userNotes?: string;
  nutritionistFeedback?: string;
  nextWeekFocus?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MeasurementSchema = new Schema<IUserMeasurement>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    value: {
      type: Number,
      required: true,
    },

    unit: {
      type: String,
      enum: Object.values(MeasurementUnit),
      required: true,
    },
  },
  {
    _id: false,
  },
);

const UserWeeklyCheckInSchema = new Schema<IUserWeeklyCheckIn>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    userProgramId: {
      type: Schema.Types.ObjectId,
      ref: "UserProgram",
      required: true,
      index: true,
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
      index: true,
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
  {
    userProgramId: 1,
    weekNumber: 1,
  },
  {
    unique: true,
  },
);
UserWeeklyCheckInSchema.index({
  userId: 1,
  startDate: -1,
});
UserWeeklyCheckInSchema.index({
  userProgramId: 1,
  startDate: -1,
});

export const UserWeeklyCheckInModel = model<IUserWeeklyCheckIn>(
  "UserWeeklyCheckIn",
  UserWeeklyCheckInSchema,
);