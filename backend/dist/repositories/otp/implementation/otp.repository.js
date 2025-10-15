"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpRepository = void 0;
const otp_model_1 = require("../../../models/otp.model");
class OtpRepository {
    async upsertOtp(email, otp, expiresAt) {
        await otp_model_1.OtpModel.findOneAndUpdate({ email }, { email, otp, expiresAt }, { upsert: true, new: true });
    }
    async findByEmail(email) {
        return await otp_model_1.OtpModel.findOne({ email });
    }
    async deleteByEmail(email) {
        await otp_model_1.OtpModel.deleteOne({ email });
    }
}
exports.OtpRepository = OtpRepository;
