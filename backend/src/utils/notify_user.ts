import { createNotifications } from "@/models/notification_model.js";

export const notifyUser = async (
  actorId: number,
  targetUserId: number | null | undefined,
  task_id: number | null,
  type: string,
  message: string,
) => {
  if (!targetUserId || targetUserId === actorId) return;

  try {
    await createNotifications(targetUserId, task_id, type, message);
  } catch (error) {
    console.error("notify User failed", error);
  }
};
