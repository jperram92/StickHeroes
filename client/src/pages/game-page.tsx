import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { GameEngine } from "@/lib/game-engine";
import Chat from "@/components/game/chat";
import Customizer from "@/components/game/customizer";

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user } = useAuth();
  const gameRef = useRef<GameEngine | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !user) return;

    const game = new GameEngine(canvasRef.current, user);
    gameRef.current = game;

    return () => {
      game.dispose();
    };
  }, [user]);

  return (
    <div className="h-screen w-screen flex">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      <div className="absolute bottom-4 right-4 flex flex-col gap-4">
        <Customizer />
        <Chat />
      </div>
    </div>
  );
}
