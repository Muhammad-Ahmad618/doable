import express from "express";
import {
  fetchAllTasks,
  fetchMyTasks,
  AddNewTask,
  updateTaskDetails,
  updateTaskStatus,
  removeTask,
  fetchAssignedTasks,
  hardDeleteTaskController,
  recoverTask,
  getDailyFocus,
  saveTaskBreakdown,
  breakdownTask,
  getRiskReport,
  updateTaskDueDate,
  updateTaskPriority,
  fetchAllSubTasks,
  removeSubtask,
  toggleSubtaskStatus,
} from "../controllers/task_controller.js";
import { protect } from "@/middleware/authentication.js";
import { authorize } from "@/middleware/authorization.js";

const router = express.Router();

router.get("/task", protect, authorize("admin"), fetchAllTasks);
router.post("/task", protect, AddNewTask);
router.put("/task/:id", protect, updateTaskDetails);
router.patch("/task/:id/status", protect, updateTaskStatus);
router.patch("/task/:id/due-date", protect, updateTaskDueDate);
router.patch("/task/:id/priority", protect, updateTaskPriority);
router.delete("/task/:id", protect, removeTask);
router.delete("/task/:id/hard", protect, hardDeleteTaskController);
router.post("/task/recover/:id", protect, recoverTask);
router.get("/task/my-tasks", protect, fetchMyTasks);
router.get("/task/assigned/:id", protect, fetchAssignedTasks);

// Daily Focus
router.get("/task/focus", protect, getDailyFocus);

//Breakdown Routes
router.post("/task/:id/breakdown", protect, breakdownTask);
router.post("/task/:id/breakdown/save", protect, saveTaskBreakdown);
router.get("/task/:id/subtasks", protect, fetchAllSubTasks);
router.patch("/task/:id/subtask/:subtask_id", protect, removeSubtask);
router.patch("/task/:id/subtask/:subtask_id", protect, toggleSubtaskStatus);

//Risk Routes
router.get("/task/risk", protect, getRiskReport);

export default router;
