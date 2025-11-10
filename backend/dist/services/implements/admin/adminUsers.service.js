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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUsersService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../types/types");
let AdminUsersService = class AdminUsersService {
    constructor(_userRepository, _nutritionistDetailsRepo) {
        this._userRepository = _userRepository;
        this._nutritionistDetailsRepo = _nutritionistDetailsRepo;
    }
    async getAllClients() {
        return this._userRepository.getAllClients();
    }
    async getAllNutritionists() {
        return this._userRepository.getAllNutritionists();
    }
    async blockUser(userId) {
        return this._userRepository.blockUser(userId);
    }
    async unblockUser(userId) {
        return this._userRepository.unblockUser(userId);
    }
    async getNutritionistById(userId) {
        const nutritionist = await this._nutritionistDetailsRepo.findByUserId(userId);
        return nutritionist;
    }
};
exports.AdminUsersService = AdminUsersService;
exports.AdminUsersService = AdminUsersService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.INutritionistDetailsRepository)),
    __metadata("design:paramtypes", [Object, Object])
], AdminUsersService);
