"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminNotificationRepository = void 0;
const mongoose_1 = require("mongoose");
const base_repository_1 = require("../base.repository");
const notification_model_1 = require("../../models/notification.model");
class AdminNotificationRepository extends base_repository_1.BaseRepository {
    constructor(model = notification_model_1.NotificationModel) {
        super(model);
    }
    async createNotification(data) {
        await this._model.create(data);
    }
    async getAllNotifications() {
        return this._model.find();
    }
    async markNotificationRead(id) {
        await this._model.findByIdAndUpdate(id, { read: true });
    }
    async deleteNotification(id) {
        await this._model.findByIdAndDelete(id);
    }
    async approveNutritionist(userId) {
        await this._model.db.collection("users").updateOne({ _id: new mongoose_1.Types.ObjectId(userId) }, { $set: { nutritionistStatus: "approved" } });
    }
    async rejectNutritionist(userId, reason) {
        await this._model.db.collection("users").updateOne({ _id: new mongoose_1.Types.ObjectId(userId) }, { $set: { nutritionistStatus: "rejected", rejectionReason: reason } });
    }
}
exports.AdminNotificationRepository = AdminNotificationRepository;
