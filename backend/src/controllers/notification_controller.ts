import { Request, Response } from "express";
import {
  createNotifications,
  getAllNotifications,
  removeAllNotifications,
  removeNotification,
  updateAllNotificationsRead,
  updateNotificationRead,
} from "@/models/notification_model.js";

export const fetchAllNotifications = async (req: Request, res: Response) => {
  const user_id = req.user?.id;

  if (!user_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const limit = Math.min(Number(req.query.limit) || 20, 50);
  const page = Math.max(Number(req.query.page) || 1, 1);
  const offset = (page - 1) * limit;
  const unreadOnly = req.query.status === "unread";

  try {
    const response = await getAllNotifications(
      user_id,
      limit,
      offset,
      unreadOnly,
    );

    return res.status(200).json({
      message: "Notifications fetched successfully",
      data: response,
      page,
      limit,
      totalPages: Math.ceil(
        (unreadOnly ? response.unread : response.total) / limit,
      ),
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching notifications" });
  }
};

export const markNotificationRead = async (req: Request, res: Response) => {
  const user_id = req.user?.id;
  const { notification_id } = req.body;

  if (!user_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!notification_id) {
    return res.status(400).json({ message: "Notification ID is required" });
  }

  try {
    const response = await updateNotificationRead(notification_id, user_id);

    if (!response) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.status(200).json({
      message: "Notification marked as read successfully",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error marking notification read" });
  }
};

export const markAllRead = async (req: Request, res: Response) => {
  const user_id = req.user?.id;

  if (!user_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const response = await updateAllNotificationsRead(user_id);

    if (!response) {
      return res.status(200).json({ message: "No notification Found" });
    }

    return res.status(200).json({
      message: "All notifications marked as read successfully",
      data: response,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error marking all notifications read" });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  const user_id = Number(req.user?.id);
  const { notification_id } = req.body;

  if (isNaN(user_id)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (isNaN(notification_id)) {
    return res.status(400).json({ message: "Notification ID is required" });
  }

  try {
    const response = await removeNotification(notification_id, user_id);

    if (!response) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.status(200).json({
      message: "Notification removed successfully",
      data: response,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error removing notification, Please try again" });
  }
};

export const clearAllNotifications = async (req: Request, res: Response) => {
  const user_id = Number(req.user?.id);

  if (isNaN(user_id)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const response = await removeAllNotifications(user_id);

    return res.status(200).json({
      message: "All notifications removed successfully",
      data: response,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error removing all notifications", error });
  }
};
