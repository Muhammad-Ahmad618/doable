import { Request, Response } from "express";
import { emailjs } from "@/services/transporter.js";

export const sendFeedback = async (req: Request, res: Response) => {
  const user_id = req.user?.id;
  const { type, message } = req.body;

  if (!user_id) {
    return res.status(401).json({ message: "unauthorized" });
  }

  if (!message || message.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "feedback cannot be empty" });
  }

  const valid_type = ["general", "bug", "idea"];
  const feedbackType = valid_type.includes(type) ? type : "general";

  try {
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_FEEDBACK_TEMPLATE_ID!,
      {
        email: process.env.email,
        feedback_type: feedbackType,
        user_name: req.user?.username,
        user_email: req.user?.email,
        message: message,
      },
    );

    return res
      .status(200)
      .json({ success: true, message: "Feedback sent successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};
