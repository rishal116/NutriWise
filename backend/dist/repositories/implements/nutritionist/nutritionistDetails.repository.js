"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutritionistDetailsRepository = void 0;
const inversify_1 = require("inversify");
const base_repository_1 = require("../../base.repository");
const nutritionistDetails_model_1 = require("../../../models/nutritionistDetails.model");
const mongoose_1 = require("mongoose");
let NutritionistDetailsRepository = class NutritionistDetailsRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(nutritionistDetails_model_1.NutritionistDetailsModel);
    }
    async createDetails(data) {
        return this.create(data);
    }
    async findByUserId(userId) {
        return this.findOne({ userId: new mongoose_1.Types.ObjectId(userId) });
    }
    async updateDetails(userId, data) {
        return nutritionistDetails_model_1.NutritionistDetailsModel.findOneAndUpdate({ userId: new mongoose_1.Types.ObjectId(userId) }, data, { new: true });
    }
};
exports.NutritionistDetailsRepository = NutritionistDetailsRepository;
exports.NutritionistDetailsRepository = NutritionistDetailsRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], NutritionistDetailsRepository);
