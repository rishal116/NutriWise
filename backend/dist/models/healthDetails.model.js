"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthDetailsModel = void 0;
const mongoose_1 = require("mongoose");
const healthDetailsSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    height: { type: Number },
    weight: { type: Number },
    bmi: { type: Number },
    activityLevel: { type: String },
    dietType: { type: String },
    dailyWaterIntake: { type: Number },
    sleepDuration: { type: String },
    goal: { type: String },
    targetWeight: { type: Number },
    preferredTimeline: { type: String },
    focusArea: { type: String },
}, { timestamps: true });
exports.HealthDetailsModel = (0, mongoose_1.model)("HealthDetails", healthDetailsSchema);
