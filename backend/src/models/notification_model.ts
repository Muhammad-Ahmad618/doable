import pool from "@/db.js";

export const getAllNotifications = async (
  user_id: Number,
  limit: number,
  offset: number,
  unreadOnly: boolean,
) => {
  try {
    const result = await pool.query(
      `
     SELECT 
     n.id,
     n.type,
     n.message,
     n.read_at,
     n.created_at,
     n.task_id,
     t.title AS task_title
     FROM notifications n
     LEFT JOIN tasks t ON t.task_id = n.task_id
     WHERE n.user_id = $1 AND ($2::boolean = false OR n.read_at IS NULL)
     ORDER BY n.created_At DESC
     LIMIT $3 AND OFFSET $4
    `,
      [user_id, unreadOnly, limit, offset],
    );

    const counts = await pool.query(
      `
      SELECT (*):: int AS total,
      COUNT (*) FILTER (WHERE read_at IS NULL)::int AS unread
      FROM notifications
      WHERE user_id = $1`,
      [user_id],
    );

    return { Notification: result.rows, ...counts.rows[0] };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const createNotifications = async (
  user_id: number,
  task_id: number,
  type: string,
  message: string,
) => {
  try {
    const result = await pool.query(
      `
      INSERT INTO notifications (user_id, task_id, type, message)
      VALUES($1,$2,$3,$4) 
      RETURNING id, type, message, read_at, created_at
      `,
      [user_id, task_id, type, message],
    );

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const updateNotificationRead = async (
  notification_id: Number,
  user_id: Number,
) => {
  try {
    const result = await pool.query(
      `
            UPDATE notifications
            SET read_at = COALESCE(read_at, NOW())
            WHERE id = $1 AND user_id = $2
            RETURNING 1
            `,
      [notification_id, user_id],
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error marking notification read:", error);
    throw error;
  }
};

export const updateAllNotificationsRead = async (user_id: Number) => {
  try {
    const result = await pool.query(
      `
            UPDATE notifications
            SET read_at = NOW()
            WHERE user_id = $1 AND read_at IS NULL
            RETURNING *;
            `,
      [user_id],
    );
    return result.rows;
  } catch (error) {
    console.error("Error marking all notifications read:", error);
    throw error;
  }
};
