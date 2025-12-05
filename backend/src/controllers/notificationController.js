import { NotificationService } from "../services/notificationService.js";

export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const result = await NotificationService.getUserNotifications(
      req.user._id, 
      parseInt(page), 
      parseInt(limit)
    );

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching notifications"
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await NotificationService.markAsRead(
      req.params.id, 
      req.user._id
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    res.json({
      success: true,
      message: "Notification marked as read",
      data: notification
    });

  } catch (error) {
    console.error("Mark notification as read error:", error);
    res.status(500).json({
      success: false,
      message: "Error marking notification as read"
    });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await NotificationService.markAllAsRead(req.user._id);

    res.json({
      success: true,
      message: "All notifications marked as read"
    });

  } catch (error) {
    console.error("Mark all notifications as read error:", error);
    res.status(500).json({
      success: false,
      message: "Error marking notifications as read"
    });
  }
};