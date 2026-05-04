import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITaskMedia {
  type: "image" | "video" | "audio" | "pdf";
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  duration?: number;
}

const TaskMediaSchema = new Schema<ITaskMedia>(
  {
    type: {
      type: String,
      enum: ["image", "video", "audio", "pdf"],
      required: true,
    },
    url: { type: String, required: true },
    thumbnailUrl: String,
    title: String,
    description: String,
    duration: Number,
  },
  { _id: false },
);

export interface ITaskInstructionStep {
  stepNumber: number;
  title: string;
  description: string;
  media?: ITaskMedia[];
}

const TaskInstructionStepSchema = new Schema<ITaskInstructionStep>(
  {
    stepNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    media: [TaskMediaSchema],
  },
  { _id: false },
);

export interface ITaskReward {
  xpPoints?: number;
  badge?: string;
}

const TaskRewardSchema = new Schema<ITaskReward>(
  {
    xpPoints: { type: Number, default: 0 },
    badge: String,
  },
  { _id: false },
);

export interface ITask extends Document {
  _id: Types.ObjectId;

  challengeId: Types.ObjectId;
  dayNumber: number;
  type: "fitness" | "nutrition" | "mental";
  title: string;
  status?: "draft" | "published" | "archived";

  order?: number;

  shortDescription?: string;
  description?: string;

  unit?: "reps" | "minutes" | "liters" | "count" | "steps" | "calories";
  targetValue?: number;
  minimumValue?: number;
  maximumValue?: number;

  isOptional?: boolean;
  isLocked?: boolean;

  category?:
    | "strength"
    | "cardio"
    | "hydration"
    | "diet"
    | "mindfulness"
    | "sleep"
    | "focus"
    | "general";

  coverImage?: string;
  media?: ITaskMedia[];

  instructionSteps?: ITaskInstructionStep[];

  estimatedDurationMinutes?: number;

  difficulty?: "easy" | "medium" | "hard";

  rewards?: ITaskReward;

  aiTips?: string[];
  safetyWarnings?: string[];

  completionCount?: number;
  averageCompletionRate?: number;

  isDeleted?: boolean;
  deletedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    challengeId: {
      type: Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },

    dayNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    order: {
      type: Number,
      default: 1,
    },

    type: {
      type: String,
      enum: ["fitness", "nutrition", "mental"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      maxlength: 300,
    },

    description: String,

    unit: {
      type: String,
      enum: ["reps", "minutes", "liters", "count", "steps", "calories"],
    },

    targetValue: Number,
    minimumValue: Number,
    maximumValue: Number,

    isOptional: {
      type: Boolean,
      default: false,
    },

    isLocked: {
      type: Boolean,
      default: false,
    },

    category: {
      type: String,
      enum: [
        "strength",
        "cardio",
        "hydration",
        "diet",
        "mindfulness",
        "sleep",
        "focus",
        "general",
      ],
      default: "general",
    },

    coverImage: String,

    media: {
      type: [TaskMediaSchema],
      default: [],
    },

    instructionSteps: {
      type: [TaskInstructionStepSchema],
      default: [],
    },

    estimatedDurationMinutes: Number,

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },

    rewards: {
      type: TaskRewardSchema,
      default: () => ({
        xpPoints: 0,
      }),
    },

    aiTips: {
      type: [String],
      default: [],
    },

    safetyWarnings: {
      type: [String],
      default: [],
    },

    completionCount: {
      type: Number,
      default: 0,
    },

    averageCompletionRate: {
      type: Number,
      default: 0,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

TaskSchema.index({ challengeId: 1, dayNumber: 1, order: 1 }, { unique: true });

TaskSchema.index({ type: 1 });
TaskSchema.index({ category: 1 });
TaskSchema.index({ difficulty: 1 });
TaskSchema.index({ title: "text", description: "text" });

export default mongoose.model<ITask>("Task", TaskSchema);
