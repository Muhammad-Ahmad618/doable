import express from "express";
import { protect } from "@/middleware/authentication.js";
import {
  fetchAllNotifications,
  markAllRead,
  markNotificationRead,
} from "@/controllers/notification_controller.js";

const router = express.Router();

router.get("/notifications", protect, fetchAllNotifications);
router.put("/notifications/mark-read", protect, markNotificationRead);
router.put("/notifications/mark-all-read", protect, markAllRead);

export default router;
