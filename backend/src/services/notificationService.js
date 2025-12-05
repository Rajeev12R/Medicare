import Notification from "../models/Notification.js";

export class NotificationService {
  static async getUserNotifications(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments({ user: userId });
    const unreadCount = await Notification.countDocuments({ 
      user: userId, 
      isRead: false 
    });

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      unreadCount
    };
  }

  static async markAsRead(notificationId, userId) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true },
      { new: true }
    );

    return notification;
  }

  static async markAllAsRead(userId) {
    await Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true }
    );
  }
}