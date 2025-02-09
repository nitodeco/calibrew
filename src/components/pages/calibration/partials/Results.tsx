import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Coffee, Settings, Scale, Timer } from "lucide-react";
import { useCalibrationStore } from "@/hooks/use-store";
import { ResultHistoryChart } from "./ResultChart";
import { useTranslations } from "next-intl";

export const CalibrationResults: FC = () => {
  const { calibrationResult: result, calibrationHistory } =
    useCalibrationStore();
  const t = useTranslations();
  return (
    <Card className="h-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <ArrowRight className="h-5 w-5" />
          <CardTitle>{t("Results.title")}</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">{t("Results.header")}</p>
      </CardHeader>
      <CardContent>
        {result ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4 space-y-4">
                <h3 className="font-medium flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Grind adjustment</span>
                </h3>
                <div className="bg-background rounded p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Grind Size</span>
                    <Badge variant="secondary" className="text-md">
                      {result.grindAdjustment}
                    </Badge>
                  </div>
                </div>

                <h3 className="font-medium flex items-center space-x-2 pt-2">
                  <Coffee className="h-4 w-4" />
                  <span>Targets</span>
                </h3>
                <div className="grid gap-3">
                  <div className="bg-background rounded p-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Scale className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Dose</span>
                    </div>
                    <Badge variant="outline">{result.doseAdjustment}</Badge>
                  </div>
                  <div className="bg-background rounded p-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Scale className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Yield</span>
                    </div>
                    <Badge variant="outline">{result.yieldAdjustment}</Badge>
                  </div>
                  <div className="bg-background rounded p-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Timer className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Brew Time</span>
                    </div>
                    <Badge variant="outline">{result.brewTimeTarget}</Badge>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <ResultHistoryChart history={calibrationHistory} />
            </div>
          </div>
        ) : (
          <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-4 space-y-4">
            <div className="relative w-16 h-16">
              <Coffee className="w-16 h-16 text-muted-foreground/20" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">{t("Results.waiting.title")}</h3>
              <p className="text-sm text-muted-foreground max-w-[250px]">
                {t("Results.waiting.description")}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
