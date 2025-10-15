"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const user_model_1 = require("../../../models/user.model");
class UserRepository {
    async createUser(data) {
        const user = new user_model_1.UserModel(data);
        return await user.save();
    }
    async findByEmail(email) {
        return await user_model_1.UserModel.findOne({ email }).exec();
    }
    async findById(id) {
        return await user_model_1.UserModel.findById(id).exec();
    }
    async updatePassword(email, hashedPassword) {
        await user_model_1.UserModel.updateOne({ email }, { $set: { password: hashedPassword } }).exec();
    }
    async verifyUser(email) {
        await user_model_1.UserModel.updateOne({ email }, { $set: { isVerified: true } }).exec();
    }
}
exports.UserRepository = UserRepository;
