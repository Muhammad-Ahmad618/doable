export type FeedbackType = "general" | "bug" | "idea";

export interface SendFeedbackPayload {
  type: FeedbackType;
  message: string;
}

export interface SendFeedbackResponse {
  success: boolean;
  message: string;
}
