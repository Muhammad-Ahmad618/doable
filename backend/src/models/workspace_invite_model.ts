import pool from "@/db.js";
import crypto from "crypto";

export const generateInviteLink = async (
  workspace_id: Number,
  created_by: Number,
) => {
  try {
    await pool.query(
      `
            UPDATE workspace_invites
            SET is_active = false
            WHERE workspace_id = $1 and is_active = true;
            `,
      [workspace_id],
    );

    const token = crypto.randomBytes(32).toString("hex");
    const expires_at = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    const result = await pool.query(
      `
            INSERT INTO workspace_invites (
                workspace_id,
                token,
                expires_at,
                created_by
            )values($1,$2,$3,$4)
            RETURNING *
            `,
      [workspace_id, token, expires_at, created_by],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error Generating Invite Link", error);
    throw error;
  }
};

export const getInviteByToken = async (token: string) => {
  try {
    const result = await pool.query(
      `
     SELECT 
     workspace_invites.*,
     workspace.name AS workspace_name,
     FROM workspace_invites
     LEFT JOIN workspace ON workspace.id = workspace_invites.workspace_id 
     WHERE workspace_invites.token = $1 
     AND workspace_invites.is_active = true
     AND workspace_invite.expires_at > NOW()
        `,
      [token],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error Fetching Invite Token", error);
    throw error;
  }
};

export const getInvitePreviewByToken = async (token: string) => {
  try {
    const result = await pool.query(
      `
SELECT
    w.name,
    w.logo_url,
    (
        SELECT COUNT(*)::int
        FROM workspace_members wm
        WHERE wm.workspace_id = w.id
    ) AS members,
    COALESCE(
        (
            SELECT json_agg(sub.avatar_url)
            FROM (
                SELECT mu.avatar_url
                FROM workspace_members wm
                JOIN users mu ON mu.id = wm.user_id
                WHERE wm.workspace_id = w.id
                  AND mu.deleted_at IS NULL
                ORDER BY wm.joined_at DESC
                LIMIT 3
            ) sub
        ),
        '[]'::json
    ) AS member_avatars
FROM workspace_invites wi
JOIN workspace w ON w.id = wi.workspace_id
JOIN users u ON u.id = wi.created_by
WHERE wi.token = $1
  AND wi.is_active = true
  AND wi.expires_at > NOW()
  AND w.deleted_at IS NULL;

    `,
      [token],
    );
    return result.rows[0];
  } catch (error) {
    console.log("Error Fetching Invite Preview", error);
    throw error;
  }
};
