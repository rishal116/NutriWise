"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthDetailsModel = void 0;
const mongoose_1 = require("mongoose");
const healthDetailsSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    bmi: { type: Number, required: true },
    activityLevel: { type: String, required: true },
    dietType: { type: String, required: true },
    dailyWaterIntake: { type: Number, required: true },
    sleepDuration: { type: String, required: true },
    goal: { type: String, required: true },
    targetWeight: { type: Number, required: true },
    preferredTimeline: { type: String, required: true },
    focusArea: { type: String, required: true },
}, { timestamps: true });
exports.HealthDetailsModel = (0, mongoose_1.model)("HealthDetails", healthDetailsSchema);
