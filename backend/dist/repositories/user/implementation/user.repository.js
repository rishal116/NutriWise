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
        return this.findOne({ email });
    }
    async createUser(data) {
        return this.create(data);
    }
    async updatePassword(email, hashedPassword) {
        await this.updateOne({ email }, { password: hashedPassword });
    }
    async verifyUser(email) {
        await this.updateOne({ email }, { isVerified: true });
    }
}
exports.UserRepository = UserRepository;
