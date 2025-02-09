import { FC, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateCalibration } from "@/app/actions/calibration";
import {
  calibrationSchema,
  type CalibrationFormData,
} from "@/lib/schemas/calibration";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RoastLevelDialog } from "@/components/pages/calibration/dialogs/roast-level-dialog";
import { GrinderDialog } from "@/components/pages/calibration/dialogs/grinder-dialog";
import { WelcomeDialog } from "@/components/pages/calibration/dialogs/welcome-dialog";
import {
  useRoastStore,
  useGrinderStore,
  useWelcomeStore,
} from "@/hooks/use-store";

export const CalibrationPage: FC = () => {
  const { roastLevel, dosageGrams, hasSetInitialRoast, setHasSetInitialRoast } =
    useRoastStore();
  const { grindSetting, hasSetGrinder, setHasSetGrinder } = useGrinderStore();
  const { hasSeenWelcome, setHasSeenWelcome } = useWelcomeStore();
  const [showRoastDialog, setShowRoastDialog] = useState(false);
  const [showGrinderDialog, setShowGrinderDialog] = useState(false);
  const [result, setResult] = useState<Awaited<
    ReturnType<typeof calculateCalibration>
  > | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CalibrationFormData>({
    resolver: zodResolver(calibrationSchema),
    defaultValues: {
      tasteBalance: 50,
      roastLevel: roastLevel,
    },
  });

  const onSubmit = async (data: CalibrationFormData) => {
    if (!grindSetting) {
      alert("Please configure your grinder settings first.");
      return;
    }

    try {
      const calibrationResult = await calculateCalibration(
        { ...data, roastLevel },
        grindSetting
      );
      setResult(calibrationResult);
    } catch (error) {
      console.error("Calibration error:", error);
      alert("Failed to calculate calibration. Please check your inputs.");
    }
  };

  const showMainContent = hasSetInitialRoast && hasSetGrinder;

  // Determine which dialog to show based on the setup state
  const showWelcomeDialog = !hasSeenWelcome;
  const showRoastSetup =
    hasSeenWelcome && (!hasSetInitialRoast || showRoastDialog);
  const showGrinderSetup =
    hasSeenWelcome &&
    hasSetInitialRoast &&
    (!hasSetGrinder || showGrinderDialog);

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

  const getRoastDescription = () => {
    if (roastLevel <= 33) return "Light roast";
    if (roastLevel <= 66) return "Medium roast";
    return "Dark roast";
  };

  return (
    <div className="container mx-auto">
      <WelcomeDialog
        open={showWelcomeDialog}
        onOpenChange={(open) => {
          if (!open) {
            setHasSeenWelcome(true);
          }
        }}
      />

      <RoastLevelDialog
        open={showRoastSetup}
        onOpenChange={(open) => {
          if (!hasSetInitialRoast) return;
          setShowRoastDialog(open);
        }}
      />

      <GrinderDialog
        open={showGrinderSetup}
        onOpenChange={(open) => {
          if (!hasSetGrinder) return;
          setShowGrinderDialog(open);
        }}
      />

      {showMainContent && (
        <>
          <div className="max-w-6xl mx-auto space-y-8">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Roast Profile</h3>
                        <p className="text-sm text-muted-foreground">
                          {getRoastDescription()} ({roastLevel}%) -{" "}
                          {dosageGrams}g dose
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowRoastDialog(true)}
                      >
                        Modify
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Grinder Configuration</h3>
                        <p className="text-sm text-muted-foreground">
                          {getGrinderDescription()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowGrinderDialog(true)}
                      >
                        Modify
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <Card className="h-full">
                <CardHeader className="space-y-1">
                  <CardTitle>Settings</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Configure your brew parameters
                  </p>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-6"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Grind Size
                        </Label>
                        <Input
                          type="number"
                          placeholder="e.g. 15"
                          {...register("grindSize", { valueAsNumber: true })}
                          className={errors.grindSize ? "border-red-500" : ""}
                        />
                        {errors.grindSize && (
                          <p className="text-xs text-red-500">
                            {errors.grindSize.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Dose (g)</Label>
                        <Input
                          type="number"
                          placeholder="e.g. 18"
                          {...register("dose", { valueAsNumber: true })}
                          className={errors.dose ? "border-red-500" : ""}
                        />
                        {errors.dose && (
                          <p className="text-xs text-red-500">
                            {errors.dose.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Brew Time (sec)
                        </Label>
                        <Input
                          type="number"
                          placeholder="e.g. 30"
                          {...register("brewTime", { valueAsNumber: true })}
                          className={errors.brewTime ? "border-red-500" : ""}
                        />
                        {errors.brewTime && (
                          <p className="text-xs text-red-500">
                            {errors.brewTime.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Yield (g)</Label>
                        <Input
                          type="number"
                          placeholder="e.g. 36"
                          {...register("yield", { valueAsNumber: true })}
                          className={errors.yield ? "border-red-500" : ""}
                        />
                        {errors.yield && (
                          <p className="text-xs text-red-500">
                            {errors.yield.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Taste Balance
                      </Label>
                      <div className="space-y-4">
                        <Slider
                          defaultValue={[50]}
                          max={100}
                          step={1}
                          onValueChange={(value) =>
                            setValue("tasteBalance", value[0])
                          }
                          className="cursor-pointer [&_[role=slider]]:hover:scale-105 [&_[role=slider]]:transition-transform [&_[role=slider]]:focus-visible:outline-none [&_[role=slider]]:-webkit-tap-highlight-color-transparent"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground font-medium">
                          <span>Too Sour</span>
                          <span>Just Right</span>
                          <span>Too Bitter</span>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full mt-4" size="lg">
                      Calculate Adjustments
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="h-full">
                <CardHeader className="space-y-1">
                  <CardTitle>Results</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Recommended adjustments for your next brew
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    {result ? (
                      <>
                        <div className="space-y-4">
                          <div className="p-4 bg-muted rounded-lg">
                            <p className="font-medium mb-2">
                              Recommended Adjustments:
                            </p>
                            <ul className="space-y-2 text-sm">
                              <li>• {result.grindAdjustment}</li>
                              <li>• {result.doseAdjustment}</li>
                              <li>• {result.yieldAdjustment}</li>
                              <li>• {result.brewTimeTarget}</li>
                            </ul>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {result.explanation}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="min-h-[400px] flex items-center justify-center text-center">
                        <p className="text-muted-foreground">
                          Your calibration results will appear here after
                          submitting your settings.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
