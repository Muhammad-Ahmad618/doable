import pool from "../db.js";

export const getAllTasks = async (
  limit: number,
  offset: number,
  status?: string,
) => {
  try {
    let query = `
      SELECT task_id,title,description,status,tasks.created_at,users.username AS name FROM tasks INNER JOIN users ON tasks.user_id = users.id WHERE tasks.deleted_at IS NULL AND ($1::TEXT IS NULL OR status = $1) ORDER BY tasks.task_id DESC LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [status ?? null, limit, offset]);
    return result.rows;
  } catch (error) {
    console.log("Error Fetching Tasks Please Try Again.", error);
    throw error;
  }
};

export const getTaskById = async (id: number) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks WHERE task_id = $1 and deleted_at IS NULL",
      [id],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error Fetching Task Please Try Again.", error);
    throw error;
  }
};

export const getMyTasks = async (
  user_id: number,
  limit: number,
  offset: number,
  status?: "pending" | "in_progress" | "completed" | null,
) => {
  try {
    let query = `
      SELECT
      tasks.task_id,
      tasks.title,
      tasks.description,
      tasks.priority,
      tasks.status,
      tasks.due_date,
      users.username AS assignee ,
      workspace.name AS workspace,
      COUNT(*) OVER() AS total_count 
      FROM tasks
      LEFT JOIN users ON tasks.assigned_to = users.id
      LEFT JOIN workspace ON tasks.workspace_id = workspace.id
      WHERE (tasks.user_id = $1 OR tasks.assigned_to = $1) AND parent_task_id is NULL AND tasks.deleted_at is NULL
    `;

    const values: (number | string)[] = [user_id];

    if (status) {
      values.push(status);
      query += ` AND tasks.status = $${values.length}`;
    }

    values.push(limit);
    query += ` ORDER BY tasks.created_at DESC LIMIT $${values.length}`;

    values.push(offset);
    query += ` OFFSET $${values.length}`;

    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.log("Error Fetching Tasks Please Try Again.", error);
    throw error;
  }
};

export const getTaskByAssignedTo = async (
  assigned_to: number,
  limit: number,
  offset: number,
  status: "pending" | "in_progress" | "completed" | null,
) => {
  try {
    const query = `
      SELECT * FROM tasks WHERE assigned_to = $1 AND deleted_at IS NULL AND ($2::TEXT IS NULL OR status = $2) ORDER BY task_id DESC LIMIT $3 OFFSET $4
    `;
    const result = await pool.query(query, [
      assigned_to,
      status ?? null,
      limit,
      offset,
    ]);
    return result.rows;
  } catch (error) {
    console.log("Error Fetching Tasks Please Try Again.", error);
    throw error;
  }
};

export const createTask = async (
  title: string,
  description: string,
  priority: "low" | "medium" | "high",
  due_date: Date,
  user_id: number,
  workspace_id?: number,
  assigned_to?: number,
) => {
  try {
    const result = await pool.query(
      "INSERT INTO tasks(title,description,user_id,workspace_id,assigned_to,priority,due_date) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING*",
      [
        title,
        description,
        user_id,
        workspace_id,
        assigned_to,
        priority,
        due_date,
      ],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error Creating Task Please Try Again.", error);
    throw error;
  }
};

export const updateTask = async (
  id: number,
  user_id: number,
  title?: string,
  description?: string,
  status?: "pending" | "in_progress" | "completed",
  priority?: "low" | "medium" | "high",
  due_date?: Date,
  assigned_to?: number,
) => {
  try {
    const result = await pool.query(
      "UPDATE tasks SET title = $1, description = $2, status = $3, priority = $4, due_date = $5, assigned_to = $6 WHERE task_id = $7 AND user_id = $8 RETURNING*",
      [
        title,
        description,
        status,
        priority,
        due_date,
        assigned_to ?? null,
        id,
        user_id,
      ],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error Updating Task Please Try Again.", error);
    throw error;
  }
};

export const hardDeleteTask = async (id: number) => {
  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE task_id = $1 RETURNING*",
      [id],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error Hard Deleting Task Please Try Again.", error);
    throw error;
  }
};

export const softDeleteTask = async (id: number) => {
  try {
    const result = await pool.query(
      "UPDATE tasks SET deleted_at = NOW() WHERE task_id = $1 RETURNING*",
      [id],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error Soft Deleting Task Please Try Again.", error);
    throw error;
  }
};

export const restoreTask = async (id: number) => {
  try {
    const result = await pool.query(
      "UPDATE tasks SET deleted_at = NULL WHERE task_id = $1 RETURNING*",
      [id],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error Restoring Task Please Try Again.", error);
    throw error;
  }
};

export const changeTaskStatus = async (
  id: number,
  user_id: number,
  status: "pending" | "in_progress" | "completed",
) => {
  try {
    const result = await pool.query(
      "UPDATE tasks SET status = $1 WHERE task_id = $2 AND user_id = $3 RETURNING*",
      [status, id, user_id],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error Changing Task Status Please Try Again.", error);
    throw error;
  }
};

export const getDailyFocusTasks = async (user_id: number) => {
  try {
    const result = await pool.query(
      `SELECT task_id, title, description, priority, due_date, status
     FROM tasks 
     WHERE (user_id = $1 OR assigned_to = $1)
     AND deleted_at is NULL
     AND status IN ('pending', 'in_progress')
     AND due_date <= CURRENT_DATE + INTERVAL '1 day'
     ORDER BY
     CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
     due_date ASC`,
      [user_id],
    );

    return result.rows;
  } catch (error) {
    console.log("Error Fetching Daily Focus Tasks Please Try Again.", error);
    throw error;
  }
};

export const saveSubTasks = async (
  subtasks: {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    due_date: Date;
  }[],
  parent_task_id: number,
  user_id: number,
) => {
  try {
    const inserted = [];
    for (const subtask of subtasks) {
      const result = await pool.query(
        `INSERT INTO tasks(title,description,priority,due_date,user_id,parent_task_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING*`,
        [
          subtask.title,
          subtask.description,
          subtask.priority,
          subtask.due_date,
          user_id,
          parent_task_id,
        ],
      );
      inserted.push(result.rows[0]);
    }
    return inserted;
  } catch (error) {
    console.log("Error Saving Sub Tasks Please Try Again.", error);
    throw error;
  }
};

export const getActiveTasksById = async (user_id: number) => {
  try {
    const result = await pool.query(
      `SELECT task_id, title, description, priority, status, due_date 
      FROM tasks
      WHERE (user_id = $1 OR assigned_to = $1)
      AND deleted_at IS NULL
      AND status IN ('pending', 'in_progress')
      ORDER BY due_date ASC
      `,
      [user_id],
    );

    return result.rows;
  } catch (error) {
    console.log("Error Fetching Active Tasks Please Try Again.", error);
    throw error;
  }
};

export const updateDueDate = async (
  task_id: number,
  user_id: number,
  due_date: string,
) => {
  try {
    const result = await pool.query(
      `UPDATE tasks 
    SET due_date = $3 
    WHERE task_id = $1 AND user_id = $2 AND deleted_at is NULL
    RETURNING *`,
      [task_id, user_id, due_date],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error updating due_date", error);
    throw error;
  }
};

export const updatePriority = async (
  task_id: number,
  user_id: number,
  priority: "low" | "medium" | "high",
) => {
  try {
    const result = await pool.query(
      `UPDATE tasks 
    SET priority = $3 
    WHERE task_id = $1 AND user_id = $2 AND deleted_at is NULL
    RETURNING *`,
      [task_id, user_id, priority],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error updating priority", error);
    throw error;
  }
};

export const getAllSubTasks = async (task_id: number) => {
  try {
    const result = await pool.query(
      `SELECT
      task_id,
      title,
      description,
      priority
      FROM tasks
      WHERE parent_task_id = $1 AND deleted_at IS NULL
      `,
      [task_id],
    );
    return result.rows;
  } catch (error) {
    console.log("Error Fetching Sub Tasks Please Try Again.", error);
    throw error;
  }
};

export const deleteSubtask = async (task_id: number, subtask_id: number) => {
  try {
    const result = await pool.query(
      `UPDATE tasks 
      SET deleted_at = NOW() 
      WHERE parent_task_id = $1 AND task_id = $2 AND deleted_at IS NULL`,
      [task_id, subtask_id],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error Deleting Sub Task Please Try Again.", error);
    throw error;
  }
};

export const updateSubtaskStatus = async (
  task_id: number,
  subtask_id: number,
  status: "pending" | "completed",
) => {
  try {
    const result = await pool.query(
      `UPDATE tasks
       SET status = $3
       WHERE parent_task_id = $1 AND task_id = $2 AND deleted_at IS NULL
       RETURNIG *
      `,
      [task_id, subtask_id, status],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error updating Sub Task Please Try Again.", error);
    throw error;
  }
};

export const deleteAllSubtasks = async (task_id: number) => {
  try {
    const result = await pool.query(
      `
      DELETE FROM tasks
      WHERE parent_task_id = $1 
      `,
      [task_id],
    );
  } catch (error) {
    console.log("Error deleteing Sub Task Please Try Again.", error);
    throw error;
  }
};
