"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const base_repository_1 = require("../../base.repository");
const user_model_1 = require("../../../models/user.model");
class UserRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(user_model_1.UserModel);
    }
    async findByEmail(email) {
        return this.model.findOne({ email });
    }
    async findById(id) {
        return this.model.findById(id);
    }
    async createUser(data) {
        return this.model.create(data);
    }
    async updateUser(id, data) {
        return this.updateById(id, data);
    }
    async updatePassword(email, hashedPassword) {
        await this.model.updateOne({ email }, { password: hashedPassword });
    }
    async verifyUser(email) {
        await this.model.updateOne({ email }, { isVerified: true });
    }
}
exports.UserRepository = UserRepository;
