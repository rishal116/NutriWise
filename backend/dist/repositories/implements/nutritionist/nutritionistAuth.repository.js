"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutritionistAuthRepository = void 0;
const base_repository_1 = require("../../base.repository");
const nutritionistDetails_model_1 = require("../../../models/nutritionistDetails.model");
class NutritionistAuthRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(nutritionistDetails_model_1.NutritionistDetailsModel);
    }
    async createNutritionistDetails(data) {
        return this._model.create(data);
    }
    async findById(id) {
        return this._model.findById(id);
    }
    async findByUserId(userId) {
        return this._model.findOne({ userId });
    }
    async updateNutritionistDetails(id, data) {
        return this.updateById(id, data);
    }
}
exports.NutritionistAuthRepository = NutritionistAuthRepository;
