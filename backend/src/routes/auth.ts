import express from "express";
import {
  login,
  register,
  forgotPassword,
  resetPassword,
  logout,
  refresh,
} from "../controllers/auth_controller.js";
import {
  loginValidator,
  registerValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from "@/validator/auth_validator.js";
import { validator } from "@/middleware/validator.js";
import { protect } from "@/middleware/authentication.js";
import { authLimiter } from "@/middleware/rate_limiter.js";

const router = express.Router();

router.post("/auth/register", registerValidator, validator, register);
router.post("/auth/login", authLimiter, loginValidator, validator, login);
router.post(
  "/auth/forgot-password",
  authLimiter,
  forgotPasswordValidator,
  validator,
  forgotPassword,
);
router.post(
  "/auth/reset-password",
  authLimiter,
  resetPasswordValidator,
  validator,
  resetPassword,
);
router.post("/auth/logout", protect, logout);
router.post("/refresh", refresh);

export default router;
