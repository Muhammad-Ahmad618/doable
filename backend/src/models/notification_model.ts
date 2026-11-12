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
     LIMIT $3 OFFSET $4
    `,
      [user_id, unreadOnly, limit, offset],
    );

    const counts = await pool.query(
      `
      SELECT 
      COUNT (*):: int AS total,
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
  task_id: number | null,
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
            RETURNING id;
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

export const removeNotification = async (id: number, user_id: number) => {
  try {
    const result = await pool.query(
      `DELETE FROM notifications
      WHERE id = $1 and user_id = $2
      RETURNING *
      `,
      [id, user_id],
    );

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

export const removeAllNotifications = async (user_id: number) => {
  try {
    const result = await pool.query(
      `
    DELETE FROM notifications
    WHERE user_id = $1   
      `,
      [user_id],
    );

    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const TODAY = `(NOW() AT TIME ZONE 'Asia/Karachi')::date`;

export const createDueSoonNotifications = async () => {
  await pool.query(`
   INSERT INTO notifications (user_id, task_id, type, message)
    SELECT COALESCE(t.assigned_to, t.created_by), t.task_id, 'task_due_soon',
           CASE
             WHEN t.due_date::date = ${TODAY}
               THEN '"' || t.title || '" is due today'
             ELSE '"' || t.title || '" is due tomorrow'
           END
    FROM tasks t
    WHERE t.status != 'completed'
      AND t.deleted_at IS NULL
      AND t.due_date::date BETWEEN ${TODAY} AND ${TODAY} + 1
      AND NOT EXISTS (
        SELECT 1 FROM notifications n
        WHERE n.task_id = t.task_id
          AND n.type = 'task_due_soon'
          AND n.created_at >= t.due_date::date - 1
      )
  `);
};

export const createOverNotifications = async () => {
  await pool.query(`
    INSERT INTO notifications (user_id, task_id, type, message)
    SELECT COALESCE(t.assigned_to, t.created_by), t.task_id, 'task_overdue',
           '"' || t.title || '" is overdue'
    FROM tasks t
    WHERE t.status != 'completed'
      AND t.deleted_at IS NULL
      AND t.due_date::date < ${TODAY}
      AND NOT EXISTS (
        SELECT 1 FROM notifications n
        WHERE n.task_id = t.task_id
          AND n.type = 'task_overdue'
          AND n.created_at >= t.due_date::date
      )
  `);
};

export const createDueNotifications = async () => {
  await Promise.all([createDueSoonNotifications(), createOverNotifications()]);
};
