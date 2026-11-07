import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  getUserByEmail,
  createUser,
  checkUserExist,
  updatePassword,
  checkExistingPassword,
} from "@/models/users_model.js";
import { Request, Response } from "express";
import crypto from "crypto";
import {
  deleteToken,
  getTokenInfo,
  insertToken,
} from "@/models/password_reset_model.js";
import {
  deleteRefreshToken,
  findRefreshToken,
  saveRefreshToken,
} from "@/models/refresh_token_model.js";
import { emailjs } from "@/utils/transporter.js";

// Login Logic
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  try {
    const user = await getUserByEmail(email);

    if (!user || user.deleted_at !== null) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid Credentials, Please try again !",
      });
    }

    const accesstoken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" },
    );

    const refreshtoken = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" },
    );

    await saveRefreshToken(user.id, refreshtoken);

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accesstoken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshtoken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again.", error });
  }
};
// Sign Up
export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ message: "email, password and name are required" });
  }

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    if (existingUser.deleted_at !== null) {
      return res.status(400).json({
        message:
          "Account is deactivated. Please contact support or restore it.",
      });
    }
    return res
      .status(400)
      .json({ message: "account already register on this mail" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await createUser(name, email, hashedPassword);

    return res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again." });
  }
};
// forgot password
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await checkUserExist(email);

    if (!user) {
      return res
        .status(200)
        .json({ message: "Password Reset Link Sent Please check your Inbox" });
    }

    const userId = user.id;

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    const storeToken = await insertToken(userId, token, expiresAt);

    if (storeToken) {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

      try {
        await emailjs.send(
          process.env.EMAILJS_SERVICE_ID!,
          process.env.EMAILJS_TEMPLATE_ID!,
          {
            to_email: email,
            reset_url: resetUrl,
          },
        );
      } catch (error) {
        console.log("Error", error);
        return res
          .status(500)
          .json({ message: "Internal server error. Please try again." });
      }

      return res
        .status(200)
        .json({ message: "If that email exists, a reset link has been sent." });
    }
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again." });
  }
};

// reset password
export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token) {
    return res.status(404).json({ message: "Token Required" });
  }

  try {
    const tokenInfo = await getTokenInfo(token);

    if (!tokenInfo) {
      return res.status(400).json({ message: "Invalid Token" });
    }

    const { user_id, expires_at } = tokenInfo;

    if (new Date() > new Date(expires_at)) {
      await deleteToken(token);
      return res.status(400).json({
        message: "Token has expired. Please request a new reset link.",
      });
    }

    const existingPassword = await checkExistingPassword(user_id);

    const isPasswordValid = await bcrypt.compare(newPassword, existingPassword);

    if (isPasswordValid) {
      return res
        .status(400)
        .json({ message: "New and Current Password cannot be the same" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await updatePassword(user_id, hashedPassword);

    await deleteToken(token);

    return res
      .status(200)
      .json({ message: "Password Updated successfully", data: user });
  } catch (error) {
    console.log("Error resetting password:", error);
    return res
      .status(500)
      .json({ message: "Error While Updating Password. Please Try Again" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.user;

    await deleteRefreshToken(id);

    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ message: "Error While Logging out. Please Try Again" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshtoken = req.cookies.refreshToken;

    if (!refreshtoken) {
      return res.status(401).json({ message: "You are not logged in" });
    }

    const decodedToken = jwt.verify(
      refreshtoken,
      process.env.JWT_REFRESH_SECRET!,
    );

    if (typeof decodedToken === "string") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id, role } = decodedToken as {
      id: number;
      role: "user" | "admin";
    };

    const storedToken = await findRefreshToken(refreshtoken);

    if (!storedToken) {
      return res
        .status(401)
        .json({ message: "Invalid session. Please log in again." });
    }

    const accesstoken = jwt.sign({ id, role }, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accesstoken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Access token generated successfully",
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};
