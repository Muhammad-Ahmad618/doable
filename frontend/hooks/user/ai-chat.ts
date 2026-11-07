import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { ChatPayload, ChatResponse } from "@/types/chat";
import { getApiErrorMessage } from "@/lib/api-error";
import { toast } from "sonner";

export const useSendMessage = () => {
  return useMutation({
    mutationFn: async (payload: ChatPayload): Promise<ChatResponse> => {
      const response = await api.post("/chat", payload);
      return response.data;
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { error?: string; message?: string } };
      };
      const errorMessage =
        err?.response?.data?.error ||
        getApiErrorMessage(error, "Failed to get reply from assistant");
      toast.error(errorMessage);
    },
  });
};

export const useChat = useSendMessage;

