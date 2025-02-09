import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGrinderStore } from "@/hooks/use-store";
import {
  GrindType,
  GrindUnit,
  type GrindSetting,
  GrindSetting as GrindSettingSchema,
} from "@/types/grind";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Help } from "@/components/ui/help";

interface GrinderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GrinderDialog: FC<GrinderDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { hasSetGrinder, setGrindSetting, setHasSetGrinder } =
    useGrinderStore();
  const [selectedType, setSelectedType] = useState<GrindType>("stepped");
  const [unit, setUnit] = useState<GrindUnit>("numbers");
  const [minValue, setMinValue] = useState<string>("1");
  const [maxValue, setMaxValue] = useState<string>("40");
  const [stepSize, setStepSize] = useState<string>("1");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleUnitChange = (value: GrindUnit) => {
    setUnit(value);
    setErrors({});
    if (value === "letters") {
      setMinValue("A");
      setMaxValue("Z");
    } else {
      setMinValue("1");
      setMaxValue("40");
    }
  };

  const validateAndSetGrindSetting = () => {
    let setting: GrindSetting;
    setErrors({});

    try {
      if (selectedType === "absolute") {
        setting = GrindSettingSchema.parse({
          type: "absolute",
          stepSize: parseFloat(stepSize),
        });
      } else if (selectedType === "stepped") {
        setting = GrindSettingSchema.parse({
          type: "stepped",
          unit,
          minValue:
            unit === "numbers" ? parseInt(minValue) : minValue.toUpperCase(),
          maxValue:
            unit === "numbers" ? parseInt(maxValue) : maxValue.toUpperCase(),
        });
      } else {
        setting = GrindSettingSchema.parse({
          type: "clicks",
        });
      }

      setGrindSetting(setting);
      setHasSetGrinder(true);
      onOpenChange(false);
    } catch (error) {
      if (error instanceof Error) {
        try {
          const zodErrors = JSON.parse(error.message);
          const newErrors: { [key: string]: string } = {};
          zodErrors.forEach((err: any) => {
            const field = err.path[err.path.length - 1];
            newErrors[field] = err.message;
          });
          setErrors(newErrors);
        } catch {
          setErrors({ form: "Invalid input values" });
        }
      }
    }
  };

  return (
    <TooltipProvider>
      <Dialog open={open} modal={true} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-[425px]"
          onPointerDownOutside={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <DialogHeader>
            <DialogTitle>Grinder</DialogTitle>
            <DialogDescription>
              Now it's time to setup your grind settings. Inspect your grinder
              and fill out the values below.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="space-y-6">
              {errors.form && (
                <p className="text-sm text-destructive">{errors.form}</p>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Grinder Type</Label>
                  <Help>
                    How do you adjust the grind size on your grinder?
                    <br />• Continuous - Stepless adjustment, such as a wheel
                    you can spin, but without numbers on it
                    <br />• Stepped - Fixed positions, for example numbers from
                    1 to 40
                    <br />• Click-based - Counted by clicks, typical for
                    handheld grinders
                  </Help>
                </div>
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <Select
                    defaultValue={selectedType}
                    onValueChange={(value: GrindType) => {
                      setSelectedType(value);
                      setErrors({});
                    }}
                  >
                    <SelectTrigger onClick={(e) => e.stopPropagation()}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      side="bottom"
                      onCloseAutoFocus={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <SelectItem value="absolute">Continuous</SelectItem>
                      <SelectItem value="stepped">Stepped</SelectItem>
                      <SelectItem value="clicks">Click-based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedType === "absolute" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label>Step Size</Label>
                    <Help>
                      The smallest adjustment you can make on your grinder
                    </Help>
                  </div>
                  <Input
                    type="number"
                    value={stepSize}
                    onChange={(e) => {
                      setStepSize(e.target.value);
                      setErrors({});
                    }}
                    placeholder="e.g. 1"
                    min="0.1"
                    step="0.1"
                  />
                  {errors.stepSize && (
                    <p className="text-sm text-destructive">
                      {errors.stepSize}
                    </p>
                  )}
                </div>
              )}

              {selectedType === "stepped" && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label>Unit</Label>
                      <Help>
                        Does your grinder use numbers or letters as its unit of
                        measurement?
                      </Help>
                    </div>
                    <div
                      className="relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Select
                        defaultValue={unit}
                        onValueChange={handleUnitChange}
                      >
                        <SelectTrigger onClick={(e) => e.stopPropagation()}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent
                          side="bottom"
                          onCloseAutoFocus={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <SelectItem value="numbers">Numbers</SelectItem>
                          <SelectItem value="letters">Letters</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label>Finest Setting</Label>
                        <Help>
                          The smallest/finest grind setting on your grinder
                          (usually 1 or A)
                        </Help>
                      </div>
                      <Input
                        value={minValue}
                        onChange={(e) => {
                          setMinValue(e.target.value);
                          setErrors({});
                        }}
                        placeholder={unit === "numbers" ? "1" : "A"}
                        type={unit === "numbers" ? "number" : "text"}
                        min={unit === "numbers" ? "0" : undefined}
                        maxLength={unit === "letters" ? 1 : undefined}
                      />
                      {errors.minValue && (
                        <p className="text-sm text-destructive">
                          {errors.minValue}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label>Coarsest Setting</Label>
                        <Help>
                          The largest/coarsest grind setting on your grinder
                          (e.g. 40 or Z)
                        </Help>
                      </div>
                      <Input
                        value={maxValue}
                        onChange={(e) => {
                          setMaxValue(e.target.value);
                          setErrors({});
                        }}
                        placeholder={unit === "numbers" ? "40" : "Z"}
                        type={unit === "numbers" ? "number" : "text"}
                        min={unit === "numbers" ? "1" : undefined}
                        maxLength={unit === "letters" ? 1 : undefined}
                      />
                      {errors.maxValue && (
                        <p className="text-sm text-destructive">
                          {errors.maxValue}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {selectedType === "clicks" && (
                <p className="text-sm text-muted-foreground">
                  We'll provide adjustments in terms of clicks from your current
                  position.
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={validateAndSetGrindSetting}>Continue</Button>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};
