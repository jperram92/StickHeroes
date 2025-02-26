import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Customizer() {
  const { user } = useAuth();

  const updateMutation = useMutation({
    mutationFn: async (character: typeof user.character) => {
      const res = await apiRequest("PATCH", "/api/character", character);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/user"], data);
    },
  });

  if (!user) return null;

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Customize Character</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Color</Label>
          <Input
            type="color"
            value={user.character.color}
            onChange={(e) =>
              updateMutation.mutate({
                ...user.character,
                color: e.target.value,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Height</Label>
          <Slider
            value={[user.character.height]}
            min={0.5}
            max={2}
            step={0.1}
            onValueChange={([height]) =>
              updateMutation.mutate({
                ...user.character,
                height,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Width</Label>
          <Slider
            value={[user.character.width]}
            min={0.5}
            max={2}
            step={0.1}
            onValueChange={([width]) =>
              updateMutation.mutate({
                ...user.character,
                width,
              })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
