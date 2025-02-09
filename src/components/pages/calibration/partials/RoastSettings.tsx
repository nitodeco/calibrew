import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";
import { useRoastStore } from "@/hooks/use-store";

export const RoastProfileCard: FC = () => {
  const { roastLevel, dosageGrams, setShowRoastDialog } = useRoastStore();

  const getRoastDescription = () => {
    if (roastLevel <= 33) return "Light roast";
    if (roastLevel <= 66) return "Medium roast";
    return "Dark roast";
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle>Roast Profile</CardTitle>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowRoastDialog(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-6">
          <div className="relative w-24 h-24 rounded-full flex items-center justify-center bg-muted">
            <div
              className="w-20 h-20 rounded-full"
              style={{
                background: `hsl(${30 - roastLevel * 0.3}, ${
                  70 - roastLevel * 0.4
                }%, ${40 - roastLevel * 0.25}%)`,
              }}
            />
          </div>
          <div className="space-y-3 flex-1">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Roast Level
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold">{roastLevel}%</span>
                <Badge variant="secondary">{getRoastDescription()}</Badge>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dose</p>
              <span className="text-xl font-semibold">{dosageGrams}g</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
