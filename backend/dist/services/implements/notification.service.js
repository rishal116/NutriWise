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
exports.AdminNotificationService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../types/types");
let AdminNotificationService = class AdminNotificationService {
    constructor(_notificationRepo, _userRepo) {
        this._notificationRepo = _notificationRepo;
        this._userRepo = _userRepo;
    }
    async getAllNotifications() {
        return this._notificationRepo.getAllNotifications();
    }
    async markNotificationRead(notificationId) {
        await this._notificationRepo.markNotificationRead(notificationId);
    }
    async deleteNotification(notificationId) {
        await this._notificationRepo.deleteNotification(notificationId);
    }
    async approveNutritionist(userId) {
        await this._userRepo.updateById(userId, { nutritionistStatus: "approved" });
        const notification = {
            title: "Your profile has been approved",
            message: "Congratulations! Your nutritionist profile is now approved.",
            type: "success",
            userId,
        };
        await this._notificationRepo.createNotification(notification);
    }
    async rejectNutritionist(userId, reason) {
        await this._userRepo.updateById(userId, { nutritionistStatus: "rejected" });
        const notification = {
            title: "Your profile has been rejected",
            message: `Your nutritionist profile was rejected. Reason: ${reason}`,
            type: "error",
            userId,
        };
        await this._notificationRepo.createNotification(notification);
    }
};
exports.AdminNotificationService = AdminNotificationService;
exports.AdminNotificationService = AdminNotificationService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IAdminNotificationRepository)),
    __param(1, (0, inversify_1.inject)(types_1.TYPES.IUserRepository)),
    __metadata("design:paramtypes", [Object, Object])
], AdminNotificationService);
