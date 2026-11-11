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

export const notifyTaskParticipants = async (
  actorId: number,
  task: {
    task_id: number;
    assigned_to: number | null;
    created_by: number | null;
  },
  type: string,
  message: string,
) => {
  const recipients = new Set(
    [task.assigned_to, task.created_by].filter(Boolean).map(Number),
  );

  for (const userId of recipients) {
    await notifyUser(actorId, userId, task.task_id, type, message);
  }
};
