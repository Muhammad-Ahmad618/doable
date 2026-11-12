import express from "express";
import { protect } from "@/middleware/authentication.js";
import {
  clearAllNotifications,
  deleteNotification,
  fetchAllNotifications,
  markAllRead,
  markNotificationRead,
} from "@/controllers/notification_controller.js";

const router = express.Router();

router.get("/notifications", protect, fetchAllNotifications);
router.put("/notifications/mark-read", protect, markNotificationRead);
router.put("/notifications/mark-all-read", protect, markAllRead);
router.delete("/notifications/clear", protect, deleteNotification);
router.delete("/notifications/clear-all", protect, clearAllNotifications);

export default router;
