import pool from "../db.js";

export const createUser = async (
  username: string,
  email: string,
  password: string,
) => {
  try {
    const result = await pool.query(
      "INSERT INTO users(username,email,password) VALUES($1,$2,$3) RETURNING id,username",
      [username, email, password],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error Creating User Please Try Again.", error);
    throw error;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  } catch (error) {
    console.log("Error Fetching User Please Try Again.", error);
    throw error;
  }
};

export const getAllUsers = async (
  limit: number,
  offset: number,
  role?: string,
) => {
  try {
    let query = "SELECT * FROM users WHERE deleted_at IS NULL";

    const values: (number | string)[] = [];

    if (role) {
      values.push(role);
      query += ` AND role = $${values.length}`;
    }

    query += " ORDER BY created_at DESC";

    values.push(limit);
    query += ` LIMIT $${values.length} `;

    values.push(offset);
    query += ` OFFSET $${values.length}`;

    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.log("Error Fetching Users Please Try Again.", error);
    throw error;
  }
};

export const getCurrentUser = async (id: number) => {
  try {
    const result = await pool.query(
      `
      SELECT username, email, bio, avatar_url, role, created_at 
      FROM users 
      WHERE id = $1 AND deleted_at IS NULL
      `,
      [id],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error Fetching User Please Try Again.", error);
    throw error;
  }
};

export const harddeleteUser = async (id: number) => {
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error Deleting User Please Try Again.", error);
    throw error;
  }
};

export const updateUser = async (
  id: number,
  password: string,
  email: string,
) => {
  try {
    const result = await pool.query(
      "UPDATE users SET email = $1, password = $2 WHERE id = $3 RETURNING id,email",
      [email, password, id],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error Updating User Please Try Again.", error);
    throw error;
  }
};

export const updatePassword = async (id: number, password: string) => {
  try {
    const result = await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2 RETURNING id,email",
      [password, id],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error Updating Password Please Try Again.", error);
    throw error;
  }
};

export const checkUserExist = async (email: string) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  } catch (error) {
    console.log("Error Fetching User Please Try Again.", error);
    throw error;
  }
};

export const checkExistingPassword = async (id: number) => {
  try {
    const result = await pool.query(
      "SELECT password FROM users WHERE id = $1",
      [id],
    );
    return result.rows[0].password;
  } catch (error) {
    console.log("Error Fetching Password Please Try Again.", error);
    throw error;
  }
};

export const softDeleteUser = async (id: number) => {
  try {
    const result = await pool.query(
      "UPDATE users SET deleted_at = NOW() WHERE id = $1 RETURNING id",
      [id],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error Soft Deleting User Please Try Again.", error);
    throw error;
  }
};

export const restoreUser = async (id: number) => {
  try {
    const result = await pool.query(
      "UPDATE users SET deleted_at = NULL WHERE id = $1 RETURNING id,username",
      [id],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error Restoring User Please Try Again.", error);
    throw error;
  }
};

// Update user profile information -> Settings
export const updateUserProfile = async (
  id: number,
  username: string,
  bio: string,
  avatar_url: string | null,
) => {
  try {
    const result = await pool.query(
      `
      UPDATE users SET username = $1, bio = $2, avatar_url = COALESCE($3, avatar_url) WHERE id = $4 AND deleted_at IS NULL RETURNING id,username,email,bio,avatar_url
      `,
      [username, bio, avatar_url, id],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error Updating User Please Try Again.", error);
    throw error;
  }
};

export const getUserPreferences = async (user_id: Number) => {
  try {
    const result = await pool.query(
      `
     SELECT * FROM user_preferences WHERE user_id = $1
        `,
      [user_id],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error Fetching User Preferences Please Try Again.", error);
    throw error;
  }
};

export const upsertUserPreferences = async (
  user_id: Number,
  in_app_notifications: boolean,
  at_risk_alerts: boolean,
  task_assigned: boolean,
  task_due_soon: boolean,
  comment_mentions: boolean,
) => {
  try {
    const result = await pool.query(
      `
      INSERT INTO user_preferences
      (user_id,in_app_notifications,at_risk_alerts,task_assigned,task_due_soon,comment_mentions)
      VALUES
      ($1,$2,$3,$4,$5,$6)
      ON CONFLICT(user_id) 
      DO UPDATE 
      SET
      in_app_notifications = $2,
      at_risk_alerts = $3,
      task_assigned = $4,
      task_due_soon = $5,
      comment_mentions = $6,
      updated_at = NOW()
      RETURNING *
      `,
      [
        user_id,
        in_app_notifications,
        at_risk_alerts,
        task_assigned,
        task_due_soon,
        comment_mentions,
      ],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error Updating User Preferences Please Try Again.", error);
    throw error;
  }
};
