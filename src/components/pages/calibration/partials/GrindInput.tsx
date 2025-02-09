import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Coffee } from "lucide-react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { CalibrationFormData } from "@/lib/schemas/calibration";
import { useGrinderStore } from "@/hooks/use-store";
import { useTranslations } from "next-intl";

interface GrindDoseSectionProps {
  register: UseFormRegister<CalibrationFormData>;
  errors: FieldErrors<CalibrationFormData>;
  setValue: UseFormSetValue<CalibrationFormData>;
  watch: UseFormWatch<CalibrationFormData>;
}

export const GrindDoseSection: FC<GrindDoseSectionProps> = ({
  register,
  errors,
  setValue,
  watch,
}) => {
  const { grindSetting, reverseScale } = useGrinderStore();
  const currentGrindSize = watch("grindSize");
  const t = useTranslations();
  const renderGrindInput = () => {
    if (!grindSetting) {
      return (
        <Input
          type="number"
          placeholder="Configure grinder first"
          disabled
          className="pr-8"
        />
      );
    }

    switch (grindSetting.type) {
      case "absolute":
        return (
          <Input
            type="number"
            placeholder={`e.g. ${grindSetting.stepSize * 15}`}
            step={grindSetting.stepSize}
            {...register("grindSize", { valueAsNumber: true })}
            className={errors.grindSize ? "border-red-500 pr-8" : "pr-8"}
          />
        );
      case "stepped":
        if (grindSetting.unit === "numbers") {
          const min = grindSetting.minValue as number;
          const max = grindSetting.maxValue as number;
          const displayMin = reverseScale ? max : min;
          const displayMax = reverseScale ? min : max;

          const handleSliderChange = (value: number[]) => {
            const actualValue = reverseScale
              ? max - (value[0] - min)
              : value[0];
            setValue("grindSize", actualValue);
          };

          const displayValue = reverseScale
            ? max - (currentGrindSize - min)
            : currentGrindSize;

          return (
            <div className="space-y-4">
              <div className="relative pt-5">
                <Slider
                  value={[displayValue || min]}
                  min={min}
                  max={max}
                  step={1}
                  onValueChange={handleSliderChange}
                  className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                />
                <div className="absolute -top-2 left-0 right-0 flex justify-between text-xs text-muted-foreground">
                  <span>
                    {t("Inputs.grind.slider.fine")} ({displayMin})
                  </span>
                  <span>
                    {t("Inputs.grind.slider.coarse")} ({displayMax})
                  </span>
                </div>
              </div>
              <div className="text-center">
                <span className="text-sm font-medium">
                  {currentGrindSize || min}
                </span>
              </div>
            </div>
          );
        } else {
          const min = (grindSetting.minValue as string).charCodeAt(0) - 64;
          const max = (grindSetting.maxValue as string).charCodeAt(0) - 64;
          const currentValue = currentGrindSize || min;

          return (
            <div className="space-y-4">
              <div className="relative pt-5">
                <Slider
                  value={[currentValue]}
                  min={min}
                  max={max}
                  step={1}
                  onValueChange={(value) => setValue("grindSize", value[0])}
                  className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                />
                <div className="absolute -top-2 left-0 right-0 flex justify-between text-xs text-muted-foreground">
                  <span>
                    {t("Inputs.grind.slider.fine")} (
                    {String.fromCharCode(min + 64)})
                  </span>
                  <span>
                    {t("Inputs.grind.slider.coarse")} (
                    {String.fromCharCode(max + 64)})
                  </span>
                </div>
              </div>
              <div className="text-center">
                <span className="text-sm font-medium">
                  {String.fromCharCode(currentValue + 64)}
                </span>
              </div>
            </div>
          );
        }
      case "clicks":
        return (
          <Input
            type="number"
            placeholder="e.g. 15 clicks"
            min={0}
            max={50}
            {...register("grindSize", { valueAsNumber: true })}
            className={errors.grindSize ? "border-red-500 pr-8" : "pr-8"}
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Coffee className="h-4 w-4" />
        <h3 className="font-medium">{t("Inputs.grind.title")}</h3>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center space-x-1">
          <span>{t("Inputs.grind.slider.title")}</span>
        </Label>
        <div className="relative">
          {renderGrindInput()}
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <span className="text-sm text-muted-foreground">
              {grindSetting?.type === "clicks" ? "clicks" : ""}
            </span>
          </div>
        </div>
        {errors.grindSize && (
          <p className="text-xs text-red-500">{errors.grindSize.message}</p>
        )}
      </div>
    </div>
  );
};
