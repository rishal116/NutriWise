"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutritionistDetailsModel = void 0;
const mongoose_1 = require("mongoose");
const ExperienceSchema = new mongoose_1.Schema({
    role: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    years: { type: Number, required: true, min: 0 },
}, { _id: false });
const NutritionistDetailsSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    qualifications: {
        type: [String],
        required: [true, "At least one qualification is required"],
        trim: true,
    },
    specializations: {
        type: [String],
        required: [true, "At least one specialization is required"],
        trim: true,
    },
    experiences: {
        type: [ExperienceSchema],
        required: [true, "Experience details are required"],
        validate: [(val) => val.every(exp => exp.years > 0), "Experience years must be greater than 0"]
    },
    bio: {
        type: String,
        trim: true,
        maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    languages: {
        type: [String],
        required: [true, "At least one language is required"],
    },
    videoCallRate: {
        type: Number,
        required: [true, "Video call rate is required"],
        min: [0, "Rate must be positive"],
    },
    consultationDuration: {
        type: String,
        required: [true, "Consultation duration is required"],
        trim: true,
    },
    availabilityStatus: {
        type: String,
        enum: ["available", "unavailable", "busy"],
        default: "available",
    },
    cv: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
    collection: "NutritionistDetails",
});
exports.NutritionistDetailsModel = (0, mongoose_1.model)("NutritionistDetails", NutritionistDetailsSchema);
