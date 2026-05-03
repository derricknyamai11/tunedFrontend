import { io, Socket } from "socket.io-client";

class WebSocketService {
  private socket: Socket | null = null;
  private backendUrl: string;

  constructor() {
    this.backendUrl = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '') || "http://localhost:5000";
  }

  public connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(this.backendUrl, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      autoConnect: true,
      withCredentials: true,
    });

    this.socket.on("connect", () => {
      console.log("[WebSocket] Connected successfully.");
    });

    this.socket.on("connect_error", (err) => {
      console.warn("[WebSocket] Connection error:", err.message);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("[WebSocket] Disconnected:", reason);
    });

    return this.socket;
  }

  public disconnect(): void {
    if (this.socket) {
      if (this.socket.connected) {
        this.socket.disconnect();
      } else {
        this.socket.close();
      }
      this.socket = null;
    }
  }


  public getSocket(): Socket | null {
    return this.socket;
  }
}

export const webSocketService = new WebSocketService();
