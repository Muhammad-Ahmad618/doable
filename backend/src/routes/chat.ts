import express from "express";
import { protect } from "@/middleware/authentication.js";
import { Chat } from "@/controllers/chat_controller.js";
import { chatLimiter } from "@/middleware/rate_limiter.js";

const router = express.Router();

router.post("/chat", protect, chatLimiter, Chat);

export default router;
