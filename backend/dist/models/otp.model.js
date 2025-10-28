"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpModel = void 0;
const mongoose_1 = require("mongoose");
const otpSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
        unique: true, // Ensure one active OTP per email
    },
    otp: {
        type: String,
        required: true,
        length: 6, // 6-digit OTP
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 1 * 60 * 1000), // 1 minute expiry
        index: { expireAfterSeconds: 0 }, // MongoDB TTL auto deletion
    },
}, {
    timestamps: true, // adds createdAt and updatedAt
});
exports.OtpModel = (0, mongoose_1.model)("Otp", otpSchema);
