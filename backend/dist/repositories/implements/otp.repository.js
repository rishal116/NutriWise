"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpRepository = void 0;
const inversify_1 = require("inversify");
const mongoose_1 = require("mongoose");
const otp_model_1 = require("../../models/otp.model");
const logger_1 = __importDefault(require("../../utils/logger"));
let OtpRepository = class OtpRepository {
    async saveOtp(email, otp, expiresAt) {
        try {
            const cleanEmail = email.toLowerCase().trim();
            await otp_model_1.OtpModel.deleteMany({ email: cleanEmail });
            const otpRecord = await otp_model_1.OtpModel.create({
                email: cleanEmail,
                otp,
                expiresAt,
            });
            logger_1.default.info(`OTP saved for email: ${cleanEmail}`);
            return otpRecord;
        }
        catch (error) {
            logger_1.default.error("Error saving OTP:", error);
            throw new Error("Failed to save OTP");
        }
    }
    async findOtpByEmail(email) {
        try {
            const cleanEmail = email.toLowerCase().trim();
            const record = await otp_model_1.OtpModel.findOne({ email: cleanEmail })
                .sort({ createdAt: -1 })
                .exec();
            logger_1.default.info(`OTP lookup for ${cleanEmail}: ${record ? "found" : "not found"}`);
            return record;
        }
        catch (error) {
            logger_1.default.error("Error finding OTP:", error);
            throw new Error("Failed to find OTP");
        }
    }
    async deleteOtp(identifier) {
        try {
            let result = null;
            if (mongoose_1.Types.ObjectId.isValid(identifier)) {
                result = await otp_model_1.OtpModel.findByIdAndDelete(identifier).exec();
            }
            else {
                result = await otp_model_1.OtpModel.findOneAndDelete({
                    email: identifier.toLowerCase().trim(),
                }).exec();
            }
            logger_1.default.info(`OTP deleted for: ${identifier}`);
            return result;
        }
        catch (error) {
            logger_1.default.error("Error deleting OTP:", error);
            throw new Error("Failed to delete OTP");
        }
    }
};
exports.OtpRepository = OtpRepository;
exports.OtpRepository = OtpRepository = __decorate([
    (0, inversify_1.injectable)()
], OtpRepository);
