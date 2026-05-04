import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITemplateTaskMedia {
  type: "image" | "video" | "audio" | "pdf";
  url: string;
  thumbnailUrl?: string;
  title?: string;
}

const TemplateTaskMediaSchema = new Schema<ITemplateTaskMedia>(
  {
    type: {
      type: String,
      enum: ["image", "video", "audio", "pdf"],
      required: true,
    },
    url: { type: String, required: true },
    thumbnailUrl: String,
    title: String,
  },
  { _id: false },
);

export interface ITemplateTask {
  taskLibraryId?: Types.ObjectId;

  type: "fitness" | "nutrition" | "mental";

  title: string;
  description?: string;

  category?:
    | "strength"
    | "cardio"
    | "hydration"
    | "diet"
    | "mindfulness"
    | "sleep"
    | "focus"
    | "general";

  targetValue?: number;

  unit?: "reps" | "minutes" | "liters" | "count" | "steps" | "calories";

  isOptional?: boolean;
  estimatedDurationMinutes?: number;

  difficulty?: "easy" | "medium" | "hard";

  coverImage?: string;
  media?: ITemplateTaskMedia[];

  aiTips?: string[];
  safetyWarnings?: string[];
}

const TemplateTaskSchema = new Schema<ITemplateTask>(
  {
    taskLibraryId: {
      type: Schema.Types.ObjectId,
      ref: "TaskLibrary",
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

    description: String,

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

    targetValue: Number,

    unit: {
      type: String,
      enum: ["reps", "minutes", "liters", "count", "steps", "calories"],
    },

    isOptional: {
      type: Boolean,
      default: false,
    },

    estimatedDurationMinutes: Number,

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },

    coverImage: String,

    media: [TemplateTaskMediaSchema],

    aiTips: [{ type: String }],
    safetyWarnings: [{ type: String }],
  },
  { _id: false },
);

export interface ITemplateDay {
  dayNumber: number;
  title?: string;
  description?: string;

  focusType?: "fitness" | "nutrition" | "mental" | "hybrid";

  tasks: ITemplateTask[];

  rewardXp?: number;
  motivationalQuote?: string;
}

const TemplateDaySchema = new Schema<ITemplateDay>(
  {
    dayNumber: {
      type: Number,
      required: true,
    },

    title: String,
    description: String,

    focusType: {
      type: String,
      enum: ["fitness", "nutrition", "mental", "hybrid"],
      default: "fitness",
    },

    tasks: [TemplateTaskSchema],

    rewardXp: {
      type: Number,
      default: 0,
    },

    motivationalQuote: String,
  },
  { _id: false },
);

export interface ITemplateReward {
  xpPoints: number;
  badge?: string;
  certificate?: boolean;
}

const TemplateRewardSchema = new Schema<ITemplateReward>(
  {
    xpPoints: { type: Number, default: 0 },
    badge: String,
    certificate: { type: Boolean, default: false },
  },
  { _id: false },
);

export interface IChallengeTemplate extends Document {
  _id: Types.ObjectId;

  title: string;
  shortDescription?: string;
  description?: string;

  slug: string;

  duration: number;

  difficulty: "easy" | "medium" | "hard";

  type: "fitness" | "nutrition" | "mental" | "hybrid";

  category:
    | "weight_loss"
    | "muscle_gain"
    | "mental_wellness"
    | "hydration"
    | "productivity"
    | "custom";

  tasksPattern: ITemplateDay[];

  coverImage?: string;
  bannerImage?: string;
  introVideo?: string;

  tags: string[];
  seoTitle?: string;
  seoDescription?: string;

  isPremium: boolean;
  price?: number;

  rewards: ITemplateReward;

  isFeatured: boolean;
  isRecommended: boolean;

  isActive: boolean;
  createdBy: Types.ObjectId;

  usageCount: number;
  totalEnrollments: number;

  visibility: "public" | "private";
  status: "draft" | "published" | "archived";
  isDeleted: boolean;
  deletedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const ChallengeTemplateSchema = new Schema<IChallengeTemplate>(
  {
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

    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
      max: 365,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    type: {
      type: String,
      enum: ["fitness", "nutrition", "mental", "hybrid"],
      required: true,
    },

    category: {
      type: String,
      enum: [
        "weight_loss",
        "muscle_gain",
        "mental_wellness",
        "hydration",
        "productivity",
        "custom",
      ],
      default: "custom",
    },

    tasksPattern: [TemplateDaySchema],

    coverImage: String,
    bannerImage: String,
    introVideo: String,

    tags: [{ type: String }],
    seoTitle: String,
    seoDescription: String,

    isPremium: {
      type: Boolean,
      default: false,
    },

    price: {
      type: Number,
      default: 0,
    },

    rewards: {
      type: TemplateRewardSchema,
      default: () => ({
        xpPoints: 0,
        certificate: false,
      }),
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isRecommended: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    usageCount: {
      type: Number,
      default: 0,
    },

    totalEnrollments: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

ChallengeTemplateSchema.index({ difficulty: 1, type: 1 });
ChallengeTemplateSchema.index({ category: 1 });
ChallengeTemplateSchema.index({ isActive: 1 });
ChallengeTemplateSchema.index({ isFeatured: 1 });
ChallengeTemplateSchema.index({ isPremium: 1 });
ChallengeTemplateSchema.index({
  title: "text",
  description: "text",
  tags: "text",
});

export default mongoose.model<IChallengeTemplate>(
  "ChallengeTemplate",
  ChallengeTemplateSchema,
);
