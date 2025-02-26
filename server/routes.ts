import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { setupAuth } from "./auth";
import { chatSchema, type User } from "@shared/schema";
import { storage } from "./storage";

const clients = new Map<number, WebSocket>();

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.patch("/api/character", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const user = await storage.updateCharacter(req.user.id, req.body);
    res.json(user);
  });

  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws, req) => {
    if (!req.url) return ws.close();
    const userId = parseInt(new URL(req.url, "http://localhost").searchParams.get("userId") || "");
    if (isNaN(userId)) return ws.close();
    
    clients.set(userId, ws);
    broadcast({ type: "join", username: "" });

    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());
        const validatedMessage = chatSchema.parse(message);
        broadcast(validatedMessage);
      } catch (err) {
        console.error("Invalid message:", err);
      }
    });

    ws.on("close", () => {
      clients.delete(userId);
      broadcast({ type: "leave", username: "" });
    });
  });

  return httpServer;
}

function broadcast(message: any) {
  const data = JSON.stringify(message);
  for (const client of clients.values()) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}
