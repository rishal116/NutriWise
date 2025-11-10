"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const admin_model_1 = require("../../../models/admin.model");
class AdminRepository {
    async findByEmail(email) {
        return await admin_model_1.AdminModel.findOne({ email });
    }
    async findAdmin() {
        return await admin_model_1.AdminModel.findOne({});
    }
}
exports.AdminRepository = AdminRepository;
