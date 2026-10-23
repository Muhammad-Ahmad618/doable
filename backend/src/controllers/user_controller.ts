import bcrypt from "bcrypt";
import { Request, Response } from "express";
import {
  getAllUsers,
  getCurrentUser,
  harddeleteUser,
  softDeleteUser,
  restoreUser,
  checkExistingPassword,
  updatePassword,
  getUserByEmail,
  updateUserProfile,
  getUserPreferences,
  upsertUserPreferences,
} from "@/models/users_model.js";
import { uploadImage } from "@/utils/upload_image.js";

export const fetchAllUsers = async (req: Request, res: Response) => {
  const { limit, offset, role } = req.query;
  const limitNum = limit ? Number(limit) : 10;
  const offsetNum = offset ? Number(offset) : 0;
  const roleStr = role?.toString() || undefined;
  try {
    const users = await getAllUsers(limitNum, offsetNum, roleStr);
    return res
      .status(200)
      .json({ message: "Users fetched successfully", data: users });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error While Fetching Users. Please Try Again" });
  }
};

export const fetchUserByEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "email is required" });
  }

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User fetched successfully", data: user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error. Please Try Again" });
  }
};

// Fetch currently logged in user
export const fetchCurrentUser = async (req: Request, res: Response) => {
  const user_id = Number(req.user?.id);

  if (!user_id) {
    return res.status(400).json({ message: "id is required" });
  }

  try {
    const user = await getCurrentUser(user_id);
    if (!user || user.deleted_at !== null) {
      return res.status(401).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User fetched successfully", data: user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error. Please Try Again" });
  }
};

// Soft delete a user
export const removeUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "id is required" });
  }

  if (req.user?.role !== "admin" && req.user?.id !== Number(id)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    const user = await softDeleteUser(Number(id));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User deleted successfully", data: user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error Deleting User. Please Try Again" });
  }
};

export const updateUserPassword = async (req: Request, res: Response) => {
  const user_id = Number(req.user?.id);
  const { current, newPassword } = req.body;

  if (!user_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!current || !newPassword) {
    return res
      .status(400)
      .json({ message: "Current Password and New Password is required" });
  }

  try {
    const existingPassword = await checkExistingPassword(user_id);

    const isCurrentPasswordValid = await bcrypt.compare(
      current,
      existingPassword,
    );

    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: "Invalid Current Password" });
    }

    const isNewPasswordSameAsCurrent = await bcrypt.compare(
      newPassword,
      existingPassword,
    );

    if (isNewPasswordSameAsCurrent) {
      return res.status(400).json({ message: "New Password Cannot Be Same" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await updatePassword(user_id, hashedPassword);
    return res.status(200).json({ message: "Password Updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error While Updating Password. Please Try Again" });
  }
};

// Permanently deletes the users
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "id is required" });
  }

  try {
    const user = await harddeleteUser(Number(id));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User deleted successfully", data: user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error Deleting User. Please Try Again" });
  }
};

// Restores the soft deleted users
export const recoverUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "id is required" });
  }

  try {
    const user = await restoreUser(Number(id));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User restored successfully", data: user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error Restoring User. Please Try Again" });
  }
};

// Update users profile information
export const UpdateUserProfile = async (req: Request, res: Response) => {
  const user_id = Number(req.user?.id);
  const { username, bio } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: "Unauthorized" });
  }
  if (!username) {
    return res.status(400).json({ message: "Enter Valid Username" });
  }

  try {
    let avatar_url: string | null = null;
    if (req.file) {
      avatar_url = await uploadImage(req.file.buffer, "users/avatars");
    }

    const user = await updateUserProfile(user_id, username, bio, avatar_url);

    return res.status(200).json({
      message: "Profile Updated Successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error While Updating Profile. Please Try Again",
    });
  }
};

// Fetch Users Notification Preferences

export const fetchUserPreferences = async (req: Request, res: Response) => {
  const user_id = Number(req.user?.id);

  if (!user_id) {
    return res.status(400).json({ message: "Unauthorized" });
  }

  try {
    const user_preferences = await getUserPreferences(user_id);

    if (!user_preferences) {
      return res.status(200).json({
        message: "No User Preferences Found",
        data: {
          in_app_notifications: true,
          at_risk_alerts: true,
          task_assigned: true,
          task_due_soon: true,
          comment_mentions: true,
          email_notifications: false,
        },
      });
    }

    return res.status(200).json({
      message: "User Preferences Fetched Successfully",
      data: user_preferences,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error While Fetching User Preferences. Please Try Again",
    });
  }
};

// Update user notification Preferences

export const updateUserPreferences = async (req: Request, res: Response) => {
  const user_id = Number(req.user?.id);
  const {
    in_app_notifications,
    at_risk_alerts,
    task_assigned,
    task_due_soon,
    comment_mentions,
  } = req.body;

  if (!user_id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const preferences = await upsertUserPreferences(
      user_id,
      in_app_notifications ?? true,
      at_risk_alerts ?? true,
      task_assigned ?? true,
      task_due_soon ?? true,
      comment_mentions ?? true,
    );

    return res.status(200).json({
      message: "User Preferences Updated Successfully",
      data: preferences,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error While Updating User Preferences. Please Try Again",
    });
  }
};

// Delete My account

export const deleteMyAccount = async (req: Request, res: Response) => {
  const user_id = Number(req.user?.id);

  if (!user_id) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  try {
    await softDeleteUser(user_id);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      message: "Account Deleted Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error While Deleting Account. Please Try Again",
    });
  }
};
