import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import type { ChatMessage } from "@shared/schema";

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const { user } = useAuth();
  const wsRef = useRef<WebSocket>();

  useEffect(() => {
    if (!user) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws?userId=${user.id}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    return () => ws.close();
  }, [user]);

  const sendMessage = () => {
    if (!input.trim() || !user || !wsRef.current) return;

    const message: ChatMessage = {
      type: "message",
      username: user.username,
      message: input.trim(),
    };

    wsRef.current.send(JSON.stringify(message));
    setInput("");
  };

  return (
    <Card className="w-80">
      <CardContent className="p-4">
        <ScrollArea className="h-48 mb-4">
          <div className="space-y-2">
            {messages.map((msg, i) => (
              <div key={i} className="text-sm">
                {msg.type === "message" ? (
                  <p>
                    <span className="font-semibold">{msg.username}:</span>{" "}
                    {msg.message}
                  </p>
                ) : (
                  <p className="text-muted-foreground italic">
                    {msg.username} {msg.type === "join" ? "joined" : "left"}
                  </p>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
}
