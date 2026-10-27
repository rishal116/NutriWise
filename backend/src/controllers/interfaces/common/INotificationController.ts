import { RequestHandler } from "express";

export interface INotificationController {
  getNotifications: RequestHandler;
  getUnreadCount: RequestHandler;
  markNotificationRead: RequestHandler;
  markAllNotificationsRead: RequestHandler;
}
