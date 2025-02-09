import { FC, useState } from "react";
import { useTranslations } from "next-intl";
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
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface GrinderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GrinderDialog: FC<GrinderDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const t = useTranslations();
  const { hasSetGrinder, setGrindSetting, setHasSetGrinder, setReverseScale } =
    useGrinderStore();
  const [selectedType, setSelectedType] = useState<GrindType>("stepped");
  const [unit, setUnit] = useState<GrindUnit>("numbers");
  const [minValue, setMinValue] = useState<string>("1");
  const [maxValue, setMaxValue] = useState<string>("40");
  const [stepSize, setStepSize] = useState<string>("1");
  const [isReversed, setIsReversed] = useState(false);
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
        setReverseScale(isReversed);
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
            <DialogTitle>{t("Dialogs.Grinder.title")}</DialogTitle>
            <DialogDescription>
              {t("Dialogs.Grinder.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="space-y-6">
              {errors.form && (
                <p className="text-sm text-destructive">{errors.form}</p>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>{t("Dialogs.Grinder.type.title")}</Label>
                  <Help>{t("Dialogs.Grinder.type.help")}</Help>
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
                      <SelectItem value="absolute">
                        {t("Dialogs.Grinder.type.continuous")}
                      </SelectItem>
                      <SelectItem value="stepped">
                        {t("Dialogs.Grinder.type.stepped")}
                      </SelectItem>
                      <SelectItem value="clicks">
                        {t("Dialogs.Grinder.type.clicks")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedType === "absolute" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label>{t("Dialogs.Grinder.stepSize.title")}</Label>
                    <Help>{t("Dialogs.Grinder.stepSize.help")}</Help>
                  </div>
                  <Input
                    type="number"
                    value={stepSize}
                    onChange={(e) => {
                      setStepSize(e.target.value);
                      setErrors({});
                    }}
                    placeholder={t("Dialogs.Grinder.stepSize.placeholder")}
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
                      <Label>{t("Dialogs.Grinder.unit.title")}</Label>
                      <Help>{t("Dialogs.Grinder.unit.help")}</Help>
                    </div>
                    <div className="flex gap-2">
                      <div
                        className="relative flex-1"
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
                            <SelectItem value="numbers">
                              {t("Dialogs.Grinder.unit.numbers")}
                            </SelectItem>
                            <SelectItem value="letters">
                              {t("Dialogs.Grinder.unit.letters")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {unit === "numbers" && (
                        <Button
                          variant="outline"
                          size="icon"
                          type="button"
                          onClick={() => setIsReversed(!isReversed)}
                          className={cn("shrink-0", isReversed && "bg-muted")}
                          title={
                            isReversed
                              ? t("Dialogs.Grinder.scale.reversed")
                              : t("Dialogs.Grinder.scale.reverse")
                          }
                        >
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      isReversed ? "coarsest" : "finest",
                      isReversed ? "finest" : "coarsest",
                    ].map((type, index) => (
                      <div key={type} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Label>
                            {t(`Dialogs.Grinder.settings.${type}.title`)}
                          </Label>
                          <Help>
                            {t(`Dialogs.Grinder.settings.${type}.help`)}
                          </Help>
                        </div>
                        <Input
                          value={type === "finest" ? minValue : maxValue}
                          onChange={(e) => {
                            type === "finest"
                              ? setMinValue(e.target.value)
                              : setMaxValue(e.target.value);
                            setErrors({});
                          }}
                          placeholder={t(
                            `Dialogs.Grinder.settings.${type}.placeholder.${unit}`
                          )}
                          type={unit === "numbers" ? "number" : "text"}
                          min={unit === "numbers" ? "0" : undefined}
                          maxLength={unit === "letters" ? 1 : undefined}
                        />
                        {(type === "finest"
                          ? errors.minValue
                          : errors.maxValue) && (
                          <p className="text-sm text-destructive">
                            {type === "finest"
                              ? errors.minValue
                              : errors.maxValue}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {selectedType === "clicks" && (
                <p className="text-sm text-muted-foreground">
                  {t("Dialogs.Grinder.clicks.description")}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={validateAndSetGrindSetting}>
              {t("Dialogs.Grinder.continue")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};
