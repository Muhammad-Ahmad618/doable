import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";

function getCookie(header: string | undefined, name: string) {
  if (!header) return undefined;
  const match = header
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

let io: Server | undefined;

const allowedOrigins = [
  process.env.CLIENT_URL, // your Vercel URL
  "http://localhost:3000", // local development
].filter(Boolean) as string[];

export function initSocket(HttpServer: HttpServer) {
  io = new Server(HttpServer, {
    cors: { origin: allowedOrigins, credentials: true },
  });

  io.use((socket, next) => {
    try {
      const token = getCookie(socket.handshake.headers.cookie, "token");

      if (!token) return next(new Error("Unauthorized"));

      const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: number;
      };
      socket.data.userId = payload.id;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });
  io.on("connection", (socket) => {
    socket.join(`user: ${socket.data.userId}`);
  });
}

export function emitToUser(userId: number, event: string, data: unknown) {
  io?.to(`user:${userId}`).emit(event, data);
}
