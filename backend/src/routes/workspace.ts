import express from "express";
import {
  createNewWorkspace,
  fetchEveryWorkspace,
  removeWorkspace,
  fetchWorkspaceMembers,
  kickoutWorkspaceMember,
  transferOwnership,
  leaveWorkspace,
  hardDeleteWorkspace,
  recoverWorkspace,
  fetchUserWorkspaces,
  generateWorkspaceInvite,
  joinWorkspaceViaInvite,
  getInvitePreview,
} from "../controllers/workspace_controller.js";
import { authorize } from "@/middleware/authorization.js";
import { protect } from "@/middleware/authentication.js";
import { validator } from "@/middleware/validator.js";
import { upload } from "@/config/multer.js";
import { createWorkspaceValidator } from "@/validator/workspace_validator.js";

const router = express.Router();

router.post(
  "/workspace/create",
  protect,
  upload.single("workspace_logo"),
  createWorkspaceValidator,
  validator,
  createNewWorkspace,
);
router.get("/workspace", protect, authorize("admin"), fetchEveryWorkspace);
router.delete("/workspace/:id", protect, removeWorkspace);
router.delete(
  "/workspace/:id/hard",
  protect,
  authorize("admin"),
  hardDeleteWorkspace,
);
router.post(
  "/workspace/recover/:id",
  protect,
  authorize("admin"),
  recoverWorkspace,
);
router.get("/workspace/:id/members", protect, fetchWorkspaceMembers);
router.delete(
  "/workspace/:workspace_id/member/:id",
  protect,
  kickoutWorkspaceMember,
);
router.post("/workspace/transfer-ownership", protect, transferOwnership);
router.post("/workspace/leave", protect, leaveWorkspace);
router.get("/workspace/my-workspaces", protect, fetchUserWorkspaces);
router.post("/workspace/:id/invite", protect, generateWorkspaceInvite);
router.post("/workspace/join/:token", protect, joinWorkspaceViaInvite);
router.get("/workspace/invite-preview/:token", getInvitePreview);

export default router;
