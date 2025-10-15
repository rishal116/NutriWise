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
        match: [/\S+@\S+\.\S+/, 'Invalid email'],
        index: true,
    },
    otp: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 6,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expireAfterSeconds: 0 },
    },
}, {
    timestamps: true,
});
otpSchema.index({ email: 1 }, { unique: true });
exports.OtpModel = (0, mongoose_1.model)("Otp", otpSchema);
