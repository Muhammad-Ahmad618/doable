import pool from "@/db.js";
import { task } from "@/Types/tasks.js";

export const getDashboardStats = async (userId: number) => {
  try {
    const result = await pool.query(
      `
   SELECT 
   COUNT (*) AS total,
   COUNT (*) FILTER (WHERE status = 'completed') AS completed,
   COUNT (*) FILTER (WHERE status = 'in_progress') AS inprogress,
   COUNT (*) FILTER (WHERE status = 'pending') AS pending,
   COUNT (*) FILTER (WHERE due_date < NOW() AND status != 'completed') AS overdue
   FROM tasks
   WHERE (user_id = $1 OR assigned_to = $1) AND parent_task_id is NULL AND deleted_at IS NULL
  `,
      [userId],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error fetching dashboard stats:", error);
    throw error;
  }
};
// task trend graph
export const getDashboardTrends = async (userId: Number, mode: string) => {
  try {
    const isMonthly = mode === "monthly";

    let result = await pool.query(
      `
      SELECT
      ${
        isMonthly
          ? `TO_CHAR(created_at, 'Mon YYYY') AS period`
          : `'Week ' || CEIL(EXTRACT(DOY FROM created_at)/ 7.0):: INT AS period`
      },
      
      COUNT (*) FILTER (WHERE status = 'completed') AS completed,
      COUNT (*) FILTER (WHERE status = 'in_progress') AS in_progress,
      COUNT (*) FILTER (WHERE due_date <= NOW() AND status != 'completed') AS overdue
      FROM tasks
      WHERE (user_id = $1 OR assigned_to = $1) 
      AND deleted_at IS NULL
      AND parent_task_id is NULL
      AND created_at >= NOW() - ${isMonthly ? "INTERVAL '6 MONTH'" : "INTERVAL '6 WEEKS'"}
      GROUP BY period 
      ORDER BY MIN(created_at)
    `,
      [userId],
    );

    return result.rows;
  } catch (error) {
    console.log("Error fetching dashboard trends:", error);
    throw error;
  }
};

export const getRecentTasks = async (userId: number) => {
  try {
    const result = await pool.query(
      `
      SELECT 
      tasks.task_id,
      tasks.title,
      tasks.description,
      tasks.priority,
      tasks.status,
      tasks.due_date,
      users.username AS assignee_name,
      workspace.name as workspace_name
       FROM tasks 
      LEFT JOIN users ON tasks.assigned_to = users.id
      LEFT JOIN workspace ON tasks.workspace_id = workspace.id 
      WHERE ( tasks.user_id = $1 OR tasks.assigned_to = $1) AND parent_task_id is NULL AND tasks.deleted_at is NULL
      ORDER BY tasks.created_at DESC
      LIMIT 10
      `,
      [userId],
    );

    return result.rows;
  } catch (error) {
    console.log("Error fetching recent tasks:", error);
    throw error;
  }
};

export const getAtRiskTasks = async (userId: number) => {
  try {
    const result = await pool.query(
      `SELECT
        task_id, title, description, priority,
        status, due_date, assigned_to, workspace_id
      FROM tasks
      WHERE (user_id = $1 OR assigned_to = $1)
        AND deleted_at IS NULL
        AND status != 'completed'
        AND parent_task_id is NULL
      `,
      [userId],
    );

    const tasks: task[] = result.rows;

    if (tasks.length === 0) return [];

    const today = new Date();

    return tasks
      .map((task) => {
        const dayUntilDue = Math.ceil(
          (new Date(task.due_date).getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        let score = 0;

        if (dayUntilDue < -7) score += 70;
        else if (dayUntilDue < 0) score += 55;
        else if (dayUntilDue <= 1) score += 40;
        else if (dayUntilDue <= 3) score += 25;
        else if (dayUntilDue <= 7) score += 15;

        if (task.priority === "high") score += 25;
        else if (task.priority === "medium") score += 15;
        else score += 10;

        score = Math.min(score, 100);

        const risk_level =
          score >= 80 ? "critical" : score >= 50 ? "high" : "medium";

        return {
          ...task,
          risk_score: score,
          risk_level: risk_level,
          daysUntilDue: dayUntilDue,
        };
      })
      .filter((task) => task.risk_score >= 50)
      .sort((a, b) => b.risk_score - a.risk_score)
      .slice(0, 5);
  } catch (error) {
    console.log("Error fetching risk score", error);
    throw error;
  }
};
