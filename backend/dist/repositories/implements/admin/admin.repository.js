"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const admin_model_1 = require("../../../models/admin.model");
class AdminRepository {
    async findByEmail(email) {
        return await admin_model_1.AdminModel.findOne({ email });
    }
    async findById(id) {
        return await admin_model_1.AdminModel.findById(id);
    }
    async updatePassword(adminId, hashedPassword) {
        await admin_model_1.AdminModel.findByIdAndUpdate(adminId, { password: hashedPassword });
    }
    async saveRefreshToken(adminId, token) {
        await admin_model_1.AdminModel.findByIdAndUpdate(adminId, { refreshToken: token });
    }
    async findByRefreshToken(token) {
        return await admin_model_1.AdminModel.findOne({ refreshToken: token });
    }
}
exports.AdminRepository = AdminRepository;
