import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { getApiErrorMessage } from "@/lib/api-error";
import { toast } from "sonner";
import { SendFeedbackPayload, SendFeedbackResponse } from "@/types/feedback";

export const useSendFeedback = () => {
  return useMutation({
    mutationFn: async (
      payload: SendFeedbackPayload,
    ): Promise<SendFeedbackResponse> => {
      const response = await api.post("/feedback", payload);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Feedback sent successfully");
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to send feedback"));
    },
  });
};

export const useSubmitFeedback = useSendFeedback;

