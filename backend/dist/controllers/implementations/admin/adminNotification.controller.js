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
exports.AdminNotificationController = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../types/types");
const asyncHandler_1 = require("../../../utils/asyncHandler");
let AdminNotificationController = class AdminNotificationController {
    constructor(_adminNotificationService) {
        this._adminNotificationService = _adminNotificationService;
        this.getAllNotifications = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const notifications = await this._adminNotificationService.getAllNotifications();
            res.status(200).json({ success: true, notifications });
        });
        this.markAsRead = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const id = req.params.id;
            await this._adminNotificationService.markNotificationRead(id);
            res.status(200).json({ success: true, message: "Notification marked as read" });
        });
        this.deleteNotification = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const id = req.params.id;
            await this._adminNotificationService.deleteNotification(id);
            res.status(200).json({ success: true, message: "Notification deleted" });
        });
        this.approveNutritionist = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.params.userId;
            await this._adminNotificationService.approveNutritionist(userId);
            res.status(200).json({ success: true, message: "Nutritionist approved" });
        });
        this.rejectNutritionist = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
            const userId = req.params.userId;
            const { reason } = req.body;
            if (!reason) {
                res.status(400).json({ success: false, message: "Rejection reason is required" });
                return;
            }
            await this._adminNotificationService.rejectNutritionist(userId, reason);
            res.status(200).json({ success: true, message: "Nutritionist rejected" });
        });
    }
};
exports.AdminNotificationController = AdminNotificationController;
exports.AdminNotificationController = AdminNotificationController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(types_1.TYPES.IAdminNotificationService)),
    __metadata("design:paramtypes", [Object])
], AdminNotificationController);
