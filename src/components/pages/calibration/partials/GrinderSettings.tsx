import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Cog, Settings } from "lucide-react";
import { useGrinderStore } from "@/hooks/use-store";

export const GrinderSettingsCard: FC = () => {
  const { grindSetting, setShowGrinderDialog } = useGrinderStore();

  const getGrinderDescription = () => {
    if (!grindSetting) return "Not configured";

    switch (grindSetting.type) {
      case "absolute":
        return `Continuous with ${grindSetting.stepSize} step size`;
      case "stepped":
        return `Stepped (${grindSetting.unit}) from ${grindSetting.minValue} to ${grindSetting.maxValue}`;
      case "clicks":
        return "Click-based adjustments";
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle>Grinder Settings</CardTitle>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowGrinderDialog(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full flex items-center justify-center bg-muted">
            <Cog className="h-12 w-12" />
          </div>
          <div className="space-y-3 flex-1">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Current Setting
              </p>
              <HoverCard>
                <HoverCardTrigger>
                  <div className="flex items-center space-x-2">
                    {grindSetting && (
                      <span className="text-2xl font-bold">
                        {grindSetting.type === "absolute"
                          ? grindSetting.stepSize
                          : grindSetting.type === "stepped"
                          ? `${grindSetting.minValue}-${grindSetting.maxValue}`
                          : "Click-based"}
                      </span>
                    )}
                    <Badge variant="secondary">{getGrinderDescription()}</Badge>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="space-y-2">
                    <p className="text-sm">Grinder Configuration Details</p>
                    <p className="text-xs text-muted-foreground">
                      {getGrinderDescription()}
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
