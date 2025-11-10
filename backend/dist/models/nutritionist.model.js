"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutritionistModel = void 0;
const mongoose_1 = require("mongoose");
const nutritionistSchema = new mongoose_1.Schema({
    fullName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, "Invalid email format"],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true,
        trim: true,
        match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    qualification: {
        type: String,
        required: [true, "Qualification is required"],
    },
    specialization: {
        type: String,
        required: [true, "Specialization is required"],
    },
    experienceYears: {
        type: Number,
        required: [true, "Experience in years is required"],
        min: [0, "Experience cannot be negative"],
    },
    bio: {
        type: String,
        trim: true,
        maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    languages: {
        type: String,
        required: [true, "Languages field is required"],
    },
    videoCallRate: {
        type: Number,
        required: [true, "Video call rate is required"],
        min: [0, "Rate must be positive"],
    },
    consultationDuration: {
        type: String,
        required: [true, "Consultation duration is required"],
    },
    availabilityStatus: {
        type: String,
        enum: ["available", "unavailable", "busy"],
        default: "available",
    },
    profileImage: { type: String },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true, collection: "nutritionists" });
exports.NutritionistModel = (0, mongoose_1.model)("Nutritionist", nutritionistSchema);
