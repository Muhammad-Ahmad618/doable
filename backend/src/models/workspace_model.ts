import pool from "../db.js";

// admin route
export const getAllWorkspaces = async (limit: number, offset: number) => {
  try {
    const result = await pool.query(
      "SELECT workspace.id,workspace.name,workspace.created_at,users.username AS owner_name FROM workspace INNER JOIN users ON workspace.owner_id = users.id WHERE workspace.deleted_at IS NULL ORDER BY workspace.id DESC LIMIT $1 OFFSET $2",
      [limit, offset],
    );
    return result.rows;
  } catch (error) {
    console.log("Error Fetching Workspace Please Try Again.", error);
    throw error;
  }
};

export const createWorkspace = async (
  name: string,
  description: string,
  owner_id: number,
  logo_url: string | null,
) => {
  try {
    const result = await pool.query(
      "INSERT INTO workspace(name, description, owner_id, logo_url) VALUES ($1,$2,$3,$4) RETURNING*",
      [name, description, owner_id, logo_url],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error Creating Workspace Please Try Again.", error);
    throw error;
  }
};

export const updateWorkspace = async (id: number, name: string) => {
  try {
    const result = await pool.query(
      "UPDATE workspace SET name = $1 WHERE id = $2 RETURNING*",
      [name, id],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error Updating Workspace Please Try Again.", error);
    throw error;
  }
};

export const deleteWorkspace = async (id: number) => {
  try {
    const result = await pool.query(
      "DELETE FROM workspace WHERE id = $1 RETURNING*",
      [id],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error Deleting Workspace Please Try Again.", error);
    throw error;
  }
};

export const getWorkspaceById = async (id: number) => {
  try {
    const result = await pool.query(
      "SELECT workspace.id, workspace.name AS workspace_name, workspace.owner_id, workspace.created_at, workspace.deleted_at, users.username AS owner_name FROM workspace INNER JOIN users ON workspace.owner_id = users.id WHERE workspace.id = $1",
      [id],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error Fetching Workspace Please Try Again.", error);
    throw error;
  }
};

export const softDeleteWorkspace = async (id: number) => {
  try {
    const result = await pool.query(
      "UPDATE workspace SET deleted_at = NOW() WHERE id = $1 RETURNING*",
      [id],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error Soft Deleting Workspace Please Try Again.", error);
    throw error;
  }
};

export const restoreWorkspace = async (id: number) => {
  try {
    const result = await pool.query(
      "UPDATE workspace SET deleted_at = NULL WHERE id = $1 RETURNING*",
      [id],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error Restoring Workspace Please Try Again.", error);
    throw error;
  }
};

export const getUserWorkspaces = async (user_id: number) => {
  try {
    const result = await pool.query(
      `SELECT
  workspace.id,
  workspace.name,
  workspace.description,
  workspace.logo_url,
  CASE
   WHEN workspace.owner_id = $1 THEN 'owner'
   ELSE workspace_member.role
  END AS role,
  COUNT(DISTINCT CASE 
  WHEN tasks.status != 'completed' AND
  tasks.deleted_at is NULL
  THEN tasks.task_id
  END) AS active_tasks,
  COUNT(DISTINCT workspace_member_all.user_id) AS member_count,
  (
   SELECT json_agg(sub.avatar_url)
   FROM(
    SELECT u.avatar_url
    FROM workspace_member wm
    JOIN users u on u.id = wm.user_id
    WHERE wm.workspace_id = workspace.id
    LIMIT 3
   )sub
  ) AS member_preview
  FROM workspace
  
  LEFT JOIN workspace_member ON workspace_member.workspace_id = workspace.id
  AND workspace_member.user_id = $1

  LEFT JOIN workspace_member AS workspace_member_all ON
  workspace_member_all.workspace_id = workspace.id
  
  LEFT JOIN tasks ON tasks.workspace_id = workspace.id
  WHERE ( workspace.owner_id = $1 OR workspace_member.user_id = $1 ) AND workspace.deleted_at is NULL
  GROUP BY
  workspace.id,
  workspace.name,
  workspace.description,
  workspace_member.role
  ORDER BY workspace.created_at DESC`,
      [user_id],
    );

    return result.rows;
  } catch (error) {
    console.log("cannot fetch workspace try again !");
    throw error;
  }
};

export const isWorkspaceMember = async (
  workspace_id: Number,
  user_id: Number,
) => {
  try {
    const result = await pool.query(
      `
      SELECT * FROM workspace_member
      WHERE workspace_id = $1  and user_id = $2;
      LIMIT 1
      `,
      [workspace_id, user_id],
    );

    return result.rows[0];
  } catch (error) {
    console.log("Error Fetching Workspace Member Please Try Again.", error);
    throw error;
  }
};
