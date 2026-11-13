"use client";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

export function useNotificationSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
      withCredentials: true,
    });
    socket.on("notification:new", () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    socket.on("connection_error", (error) => {
      console.log("socket error", error);
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);
}
