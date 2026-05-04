// dailyJournal.model.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IDailyJournal extends Document {
  _id: Types.ObjectId;

  userId: mongoose.Types.ObjectId;
  challengeId: mongoose.Types.ObjectId;

  dayNumber: number;

  mood: "excellent" | "good" | "average" | "bad";

  energyLevel: number;

  notes?: string;

  gratitude?: string;

  weight?: number;

  sleepHours?: number;

  waterIntake?: number;

  createdAt: Date;
  updatedAt: Date;
}

const DailyJournalSchema = new Schema<IDailyJournal>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    challengeId: {
      type: Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },

    dayNumber: {
      type: Number,
      required: true,
    },

    mood: {
      type: String,
      enum: ["excellent", "good", "average", "bad"],
      required: true,
    },

    energyLevel: {
      type: Number,
      min: 1,
      max: 10,
    },

    notes: String,

    gratitude: String,

    weight: Number,

    sleepHours: Number,

    waterIntake: Number,
  },
  { timestamps: true }
);

DailyJournalSchema.index({
  userId: 1,
  challengeId: 1,
  dayNumber: 1,
});

export default mongoose.model<IDailyJournal>(
  "DailyJournal",
  DailyJournalSchema
);