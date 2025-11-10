"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const base_repository_1 = require("../../base.repository");
const user_model_1 = require("../../../models/user.model");
const mongoose_1 = require("mongoose");
class UserRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(user_model_1.UserModel);
    }
    async findByEmail(email) {
        return this._model.findOne({ email });
    }
    async findById(id) {
        return this._model.findById(id);
    }
    async createUser(data) {
        return this._model.create(data);
    }
    async updateUser(id, data) {
        return this.updateById(id, data);
    }
    async updatePassword(email, hashedPassword) {
        await this._model.updateOne({ email }, { password: hashedPassword });
    }
    async getAllClients() {
        return this._model
            .find({ role: "client" }, "_id fullName email role isBlocked")
            .lean();
    }
    async getAllNutritionists() {
        return this._model
            .find({ role: "nutritionist" }, "_id fullName email role isBlocked")
            .lean();
    }
    async blockUser(userId) {
        if (!mongoose_1.Types.ObjectId.isValid(userId))
            throw new Error("Invalid userId");
        await this._model.updateOne({ _id: userId }, { isBlocked: true });
    }
    async unblockUser(userId) {
        if (!mongoose_1.Types.ObjectId.isValid(userId))
            throw new Error("Invalid userId");
        await this._model.updateOne({ _id: userId }, { isBlocked: false });
    }
    async findByGoogleId(googleId) {
        return this._model.findOne({ googleId });
    }
    async updateById(id, data) {
        return this._model.findByIdAndUpdate(id, data, { new: true });
    }
}
exports.UserRepository = UserRepository;
