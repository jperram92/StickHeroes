import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import Customizer from "@/components/game/customizer";

export default function CharacterCreation() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  if (!user) {
    setLocation("/auth");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text 3xl font-bold">Create Your Character</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center text-muted-foreground">
              Customize your character's appearance before entering the game world
            </div>
            <Customizer />
            <Button 
              className="w-full" 
              onClick={() => setLocation("/game")}
            >
              Enter Game World
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
