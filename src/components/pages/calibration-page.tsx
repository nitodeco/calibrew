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

export const CalibrationPage: FC = () => {
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
    },
  });

  const onSubmit = async (data: CalibrationFormData) => {
    try {
      const calibrationResult = await calculateCalibration(data);
      setResult(calibrationResult);
    } catch (error) {
      console.error("Calibration error:", error);
      alert("Failed to calculate calibration. Please check your inputs.");
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">
        Dial in your espresso
      </h1>

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
              <div className="space-y-2">
                <Label className="text-sm font-medium">Roast Level</Label>
                <Select
                  onValueChange={(value) =>
                    setValue(
                      "roastLevel",
                      value as CalibrationFormData["roastLevel"]
                    )
                  }
                >
                  <SelectTrigger
                    className={errors.roastLevel ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select roast level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
                {errors.roastLevel && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.roastLevel.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Grind Size</Label>
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
                  <Label className="text-sm font-medium">Brew Time (sec)</Label>
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
                <Label className="text-sm font-medium">Taste Balance</Label>
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
                    Your calibration results will appear here after submitting
                    your settings.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
