import { IoAdapter } from "@nestjs/platform-socket.io";
import { ServerOptions } from "socket.io";

// CORS 😠
export class SocketAdapter extends IoAdapter {
  createIOServer(
    port: number,
    options?: ServerOptions & { namespace?: string; server?: unknown },
  ) {
    return super.createIOServer(port, { ...options, cors: true });
  }
}