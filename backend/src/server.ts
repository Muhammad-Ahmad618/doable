import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import taskRoutes from "./routes/tasks.js";
import taskCommentRoutes from "./routes/task_comments.js";
import workspaceRoutes from "./routes/workspace.js";
import PersonalDashBoardRoutes from "./routes/p_dashboard.js";
import notificationRoutes from "./routes/notifications.js";
import feedbackRoutes from "@/routes/feedback.js";
import healthRoute from "@/routes/health.js";
import chatRoute from "@/routes/chat.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

const allowedOrigins = ["http://localhost:3000", process.env.FRONTEND_URL];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use("/api/v1/", healthRoute);
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", notificationRoutes);
app.use("/api/v1", taskRoutes);
app.use("/api/v1", taskCommentRoutes);
app.use("/api/v1", workspaceRoutes);
app.use("/api/v1", PersonalDashBoardRoutes);
app.use("/api/v1", feedbackRoutes);
app.use("/api/v1", chatRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
