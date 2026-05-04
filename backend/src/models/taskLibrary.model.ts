import mongoose, { Schema, Document, Types } from "mongoose";

/* =========================
   MEDIA SUBDOCUMENT
========================= */
export interface ITaskLibraryMedia {
  type: "image" | "video" | "audio" | "pdf";
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  duration?: number;
}

const TaskLibraryMediaSchema = new Schema<ITaskLibraryMedia>(
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
  { _id: false }
);

/* =========================
   INSTRUCTION STEPS
========================= */
export interface ITaskLibraryInstruction {
  stepNumber: number;
  title: string;
  description: string;
}

const TaskLibraryInstructionSchema = new Schema<ITaskLibraryInstruction>(
  {
    stepNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

/* =========================
   REWARD TEMPLATE
========================= */
export interface ITaskLibraryReward {
  xpPoints: number;
  badge?: string;
}

const TaskLibraryRewardSchema = new Schema<ITaskLibraryReward>(
  {
    xpPoints: { type: Number, default: 0 },
    badge: String,
  },
  { _id: false }
);

/* =========================
   MAIN TASK LIBRARY MODEL
========================= */
export interface ITaskLibrary extends Document {
  _id: Types.ObjectId;

  // Basic
  title: string;
  shortDescription?: string;
  description?: string;

  // Classification
  type: "fitness" | "nutrition" | "mental";

  category:
    | "strength"
    | "cardio"
    | "hydration"
    | "diet"
    | "mindfulness"
    | "sleep"
    | "focus"
    | "general";

  subCategory?: string;

  // Default Metrics
  defaultUnit?:
    | "reps"
    | "minutes"
    | "liters"
    | "count"
    | "steps"
    | "calories";

  defaultValue?: number;
  minimumValue?: number;
  maximumValue?: number;

  // Content
  coverImage?: string;
  media: ITaskLibraryMedia[];

  instructionSteps: ITaskLibraryInstruction[];

  // Difficulty
  difficulty: "easy" | "medium" | "hard";

  // Time
  estimatedDurationMinutes?: number;

  // Smart Features
  aiTips?: string[];
  safetyWarnings?: string[];

  // Rewards
  rewards: ITaskLibraryReward;

  // SEO / Discoverability
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;

  // Business Logic
  isPremium: boolean;
  isActive: boolean;
  isFeatured: boolean;

  // Usage Analytics
  usageCount: number;
  completionCount: number;
  averageRating: number;

  // Admin Ownership
  createdBy?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

/* =========================
   SCHEMA
========================= */
const TaskLibrarySchema = new Schema<ITaskLibrary>(
  {
    // Basic
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

    // Type
    type: {
      type: String,
      enum: ["fitness", "nutrition", "mental"],
      required: true,
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

    subCategory: String,

    // Metrics
    defaultUnit: {
      type: String,
      enum: [
        "reps",
        "minutes",
        "liters",
        "count",
        "steps",
        "calories",
      ],
    },

    defaultValue: Number,
    minimumValue: Number,
    maximumValue: Number,

    // Media
    coverImage: String,
    media: [TaskLibraryMediaSchema],

    // Instructions
    instructionSteps: [TaskLibraryInstructionSchema],

    // Difficulty
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },

    // Time
    estimatedDurationMinutes: Number,

    // Smart
    aiTips: [{ type: String }],
    safetyWarnings: [{ type: String }],

    // Rewards
    rewards: {
      type: TaskLibraryRewardSchema,
      default: () => ({
        xpPoints: 0,
      }),
    },

    // SEO
    tags: [{ type: String }],
    seoTitle: String,
    seoDescription: String,

    // Business
    isPremium: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    // Analytics
    usageCount: {
      type: Number,
      default: 0,
    },

    completionCount: {
      type: Number,
      default: 0,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    // Admin
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

/* =========================
   INDEXES
========================= */
TaskLibrarySchema.index({ type: 1, category: 1 });
TaskLibrarySchema.index({ difficulty: 1 });
TaskLibrarySchema.index({ isActive: 1 });
TaskLibrarySchema.index({ isFeatured: 1 });
TaskLibrarySchema.index({ isPremium: 1 });
TaskLibrarySchema.index({ title: "text", description: "text", tags: "text" });

export default mongoose.model<ITaskLibrary>(
  "TaskLibrary",
  TaskLibrarySchema
);