import { Request, Response } from "express";
import {
  generateDailyFocus,
  generateTaskBreakDown,
  generateRiskReport,
} from "@/services/ai_service.js";
import {
  changeTaskStatus,
  createTask,
  hardDeleteTask,
  getAllTasks,
  getTaskByAssignedTo,
  getMyTasks,
  updateTask,
  getTaskById,
  softDeleteTask,
  restoreTask,
  getDailyFocusTasks,
  saveSubTasks,
  getActiveTasksById,
  updateDueDate,
  updatePriority,
  getAllSubTasks,
  deleteSubtask,
  updateSubtaskStatus,
  deleteAllSubtasks,
} from "@/models/tasks_model.js";

// Fetch All Tasks Accross DB
export const fetchAllTasks = async (req: Request, res: Response) => {
  const { limit, offset, status } = req.query;
  const limitNum = limit ? Number(limit) : 10;
  const offsetNum = offset ? Number(offset) : 0;
  const statusVal = (status as "pending" | "in_progress" | "completed") || null;

  try {
    const tasks = await getAllTasks(limitNum, offsetNum, statusVal);

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }

    return res
      .status(200)
      .json({ message: "Tasks fetched successfully", data: tasks });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error Occured while Fetching Task Please Try Again" });
  }
};

export const fetchMyTasks = async (req: Request, res: Response) => {
  const { limit, offset, status } = req.query;
  const limitNum = limit ? Number(limit) : 10;
  const offsetNum = offset ? Number(offset) : 0;
  const statusVal = (status as "pending" | "in_progress" | "completed") || null;
  const user_id = Number(req.user?.id);

  if (!user_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const tasks = await getMyTasks(user_id, limitNum, offsetNum, statusVal);

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this user" });
    }

    const total = Number(tasks[0].total_count || 0);

    return res.status(200).json({
      message: "Tasks fetched successfully",
      data: tasks,
      pagination: {
        page: Math.floor(offsetNum / limitNum) + 1,
        limit: limitNum,
        total: total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error Please Try Again", error });
  }
};

export const AddNewTask = async (req: Request, res: Response) => {
  const { title, description, workspace_id, assigned_to, priority, due_date } =
    req.body;
  const user_id = Number(req.user?.id);

  if (!title || !description || !priority || !due_date) {
    return res.status(400).json({
      message: "Please provide title and description and priority and due date",
    });
  }

  if (!user_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const task = await createTask(
      title,
      description,
      priority,
      due_date,
      user_id,
      workspace_id,
      assigned_to,
    );
    return res
      .status(200)
      .json({ message: "Task created successfully", data: task });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error While Creating Task Please Try Again" });
  }
};

export const updateTaskDetails = async (req: Request, res: Response) => {
  const { title, description, status, assigned_to, priority, due_date } =
    req.body;
  const id = Number(req.params.id);
  const user_id = Number(req.user?.id);

  if (!title || !description || !status || !priority || !due_date) {
    return res.status(400).json({
      message: "Please provide title, description and status",
    });
  }

  if (!id) {
    return res.status(400).json({
      message: "Please provide task id",
    });
  }

  if (!user_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const task = await updateTask(
      id,
      user_id,
      title,
      description,
      status,
      priority,
      due_date,
      assigned_to,
    );
    return res
      .status(200)
      .json({ message: "Task updated successfully", data: task });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error While Updating Task Details Please Try Again" });
  }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  const task_id = Number(req.params?.id);
  const user_id = Number(req.user?.id);

  if (!status) {
    return res.status(400).json({
      message: "Please provide status",
    });
  }

  if (!task_id) {
    return res.status(400).json({
      message: "Please provide task id",
    });
  }

  if (!user_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const task = await changeTaskStatus(task_id, user_id, status);
    return res
      .status(200)
      .json({ message: "Task status changed successfully", data: task });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error While Updating Task Status Please Try Again" });
  }
};

export const updateTaskPriority = async (req: Request, res: Response) => {
  const task_id = Number(req.params.id);
  const user_id = Number(req.user?.id);
  const { priority } = req.body;

  if (!user_id) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (!task_id) {
    return res.status(400).json({
      message: "Please provide task id",
    });
  }

  try {
    const response = await updatePriority(task_id, user_id, priority);

    return res.status(200).json({
      message: "Task priority updated successfully",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error While Updating Task Priority Please Try Again",
    });
  }
};

export const updateTaskDueDate = async (req: Request, res: Response) => {
  const task_id = Number(req.params?.id);
  const user_id = Number(req.user?.id);
  const { due_date } = req.body;

  if (!user_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!task_id) {
    return res
      .status(401)
      .json({ message: "Task Id Not found Opearting Failed" });
  }

  if (!due_date) {
    return res.status(401).json({ message: "Due Date Not Found" });
  }

  try {
    const task = await getTaskById(task_id);

    if (!task || task.deleted_at !== null) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user?.role !== "admin" && task.user_id !== user_id) {
      return res.status(404).json({ message: "Forbidden" });
    }

    const result = await updateDueDate(task_id, user_id, due_date);

    return res.status(200).json({
      message: "Due Date Updated Successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while updating due date. Please try again.",
    });
  }
};

export const removeTask = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user_id = Number(req.user?.id);

  if (!id) {
    return res.status(400).json({
      message: "Please provide task id",
    });
  }

  if (!user_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const task = await getTaskById(id);
    if (!task || task.deleted_at !== null) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user?.role !== "admin" && task.user_id !== user_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const result = await softDeleteTask(id);
    return res
      .status(200)
      .json({ message: "Task deleted successfully", data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error While Deleting Task Please Try Again" });
  }
};

export const hardDeleteTaskController = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "Please provide task id",
    });
  }

  // if (req.user?.role !== "admin") {
  //   return res.status(403).json({ message: "Forbidden" });
  // }

  try {
    const task = await hardDeleteTask(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res
      .status(200)
      .json({ message: "Task hard deleted successfully", data: task });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error While Hard Deleting Task Please Try Again" });
  }
};

export const recoverTask = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "Please provide task id",
    });
  }

  // if (req.user?.role !== "admin") {
  //   return res.status(403).json({ message: "Forbidden" });
  // }

  try {
    const task = await restoreTask(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res
      .status(200)
      .json({ message: "Task restored successfully", data: task });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error While Restoring Task Please Try Again" });
  }
};

export const fetchAssignedTasks = async (req: Request, res: Response) => {
  const { status, limit, offset } = req.query;
  const limitNum = limit ? Number(limit) : 10;
  const offsetNum = offset ? Number(offset) : 0;
  const assignee_id = Number(req.params.id);

  if (!assignee_id || isNaN(assignee_id)) {
    return res.status(400).json({ message: "Invalid user ID provided" });
  }

  try {
    const tasks = await getTaskByAssignedTo(
      assignee_id,
      limitNum,
      offsetNum,
      status as "pending" | "in_progress" | "completed" | null,
    );

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this user" });
    }

    return res
      .status(200)
      .json({ message: "Tasks fetched successfully", data: tasks });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error Please Try Again" });
  }
};

export const getDailyFocus = async (req: Request, res: Response) => {
  const user_id = Number(req.user?.id);

  if (!user_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const tasks = await getDailyFocusTasks(user_id);
    const focus = await generateDailyFocus(tasks);

    return res.status(200).json({
      message: "Daily focus generated successfully",
      task_analyzed: tasks.length,
      data: focus,
    });
  } catch (error: unknown) {
    const isAiUnavailable =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      error.status === 503;

    return res.status(isAiUnavailable ? 503 : 500).json({
      message: isAiUnavailable
        ? "AI service is temporarily unavailable. Please try again in a moment."
        : "Error While Generating Daily Focus Please Try Again",
    });
  }
};

export const breakdownTask = async (req: Request, res: Response) => {
  const task_id = Number(req.params.id);
  const user_id = Number(req.user?.id);
  const { regen = false } = req.body ?? {};

  if (isNaN(task_id)) {
    return res.status(400).json({ message: "Please provide task id" });
  }
  if (isNaN(user_id)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const task = await getTaskById(task_id);
    if (!task) {
      return res.status(404).json({ message: "Task not found", data: null });
    }

    const existingSubTasks = await getAllSubTasks(task_id);
    if (existingSubTasks.length > 0 && !regen) {
      return res.status(409).json({
        message: "Break down already exists, do you wish to regenerate?",
      });
    }

    // 1. Generate FIRST (before deleting anything)
    const generated = await generateTaskBreakDown(task.title, task.description);

    if (generated.length === 0) {
      return res.status(400).json({
        message: "This task is already small enough, no breakdown needed",
        data: [],
      });
    }

    // 2. Only now delete the old ones (if regenerating)
    if (existingSubTasks.length > 0) {
      await deleteAllSubtasks(task_id);
    }

    const withDueDate = generated.map((subtask) => {
      return { ...subtask, due_date: task.due_date };
    });

    const saved = await saveSubTasks(withDueDate, task_id, user_id);

    return res.status(200).json({
      message: "Task breakdown generated successfully",
      data: saved,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error While Generating Task Breakdown Please Try Again",
    });
  }
};

export const saveTaskBreakdown = async (req: Request, res: Response) => {
  const task_id = Number(req.params.id);
  const user_id = Number(req.user?.id);

  const { subtasks } = req.body;

  if (isNaN(task_id)) {
    return res.status(400).json({
      message: "Please provide task id",
    });
  }

  if (isNaN(user_id)) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (!Array.isArray(subtasks) || subtasks.length === 0) {
    return res.status(400).json({
      message: "Please provide subtasks to save",
    });
  }

  try {
    const parent = await getTaskById(task_id);
    if (!parent) {
      return res.status(404).json({
        message: "Parent Task not found",
      });
    }

    const existingSubtasks = await getAllSubTasks(task_id);

    if (existingSubtasks.length > 0) {
      return res.status(409).json({ message: "Break Down already Saved" });
    }

    const saved = await saveSubTasks(subtasks, task_id, user_id);

    return res.status(201).json({
      message: `${saved.length} subtasks created successfully`,
      data: saved,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error While Saving Subtask Please Try Again" });
  }
};

export const getRiskReport = async (req: Request, res: Response) => {
  const user_id = req.user?.id;

  if (!user_id) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const tasks = await getActiveTasksById(user_id);
    const riskReport = await generateRiskReport(tasks);

    return res.status(200).json({
      message: "Risk report generated successfully",
      task_analyzed: tasks.length,
      data: riskReport,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error While Generating Risk Report Please Try Again" });
  }
};

export const fetchAllSubTasks = async (req: Request, res: Response) => {
  const task_id = Number(req.params?.id);

  if (!task_id) {
    return res.status(400).json({
      message: "Please provide task id",
    });
  }
  try {
    const subtasks = await getAllSubTasks(task_id);
    return res.status(200).json({
      message: "Subtasks fetched successfully",
      data: subtasks,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error While Fetching Subtasks Please Try Again" });
  }
};

export const removeSubtask = async (req: Request, res: Response) => {
  const user_id = Number(req.user?.id);
  const subtask_id = Number(req.params.subtask_id);
  const task_id = Number(req.params?.id);

  if (isNaN(user_id)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (isNaN(task_id)) {
    return res.status(401).json({ message: "Parent Task Not Found" });
  }

  if (isNaN(subtask_id)) {
    return res.status(401).json({ message: "Sub Task id not found" });
  }

  try {
    const response = await deleteSubtask(subtask_id, task_id);

    return res.status(200).json({
      message: "Sub Task deleted successfully",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error While Deleting Sub Task Please Try Again",
    });
  }
};

export const toggleSubtaskStatus = async (req: Request, res: Response) => {
  const user_id = Number(req.user?.id);
  const subtask_id = Number(req.params.subtask_id);
  const task_id = Number(req.params?.id);
  const { status } = req.body;

  if (isNaN(user_id)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (isNaN(task_id)) {
    return res.status(401).json({ message: "Parent Task Not Found" });
  }

  if (isNaN(subtask_id)) {
    return res.status(401).json({ message: "Sub Task id not found" });
  }

  try {
    const response = await updateSubtaskStatus(task_id, subtask_id, status);

    return res.status(200).json({
      message: "status update successfully",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error While Updating Sub Task Please Try Again",
      error: error,
    });
  }
};
