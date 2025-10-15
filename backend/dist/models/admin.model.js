"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModel = void 0;
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
    fullName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
        minlength: [3, "Full name must be at least 3 characters"],
        maxlength: [50, "Full name must be at most 50 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, "Invalid email format"],
    },
    password: {
        type: String,
        required: [true, "Password hash is required"],
    },
    role: {
        type: String,
        enum: ["admin"],
        default: "admin",
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    lastLogin: {
        type: Date,
    },
}, { timestamps: true });
exports.AdminModel = (0, mongoose_1.model)("Admin", adminSchema);
