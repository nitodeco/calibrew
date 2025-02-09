import { FC, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Timer } from "lucide-react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { CalibrationFormData } from "@/lib/schemas/calibration";
import { useRoastStore } from "@/hooks/use-store";
import { Slider } from "@/components/ui/slider";
import { calculateYieldRange } from "@/app/actions/settings";
import { useTranslations } from "next-intl";

interface BrewParametersSectionProps {
  register: UseFormRegister<CalibrationFormData>;
  errors: FieldErrors<CalibrationFormData>;
  setValue: UseFormSetValue<CalibrationFormData>;
}

export const BrewParametersSection: FC<BrewParametersSectionProps> = ({
  register,
  errors,
  setValue,
}) => {
  const t = useTranslations();
  const { dosageGrams } = useRoastStore();
  const { min, max, default: defaultYield } = calculateYieldRange(dosageGrams);

  const minValue = Number(min);
  const maxValue = Number(max);
  const defaultValue = Number(defaultYield || minValue);
  const [currentYield, setCurrentYield] = useState(defaultValue);

  const formatRatio = (value: number) => {
    const ratio = value / dosageGrams;
    return ratio % 1 === 0 ? ratio.toFixed(0) : ratio.toFixed(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Timer className="h-4 w-4" />
        <h3 className="font-medium">{t("Inputs.brew.title")}</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center space-x-1">
            <span>{t("Inputs.brew.time.title")}</span>
            <span className="text-muted-foreground">
              ({t("Inputs.brew.time.seconds")})
            </span>
          </Label>
          <div className="relative">
            <Input
              type="number"
              placeholder="e.g. 30"
              {...register("brewTime", { valueAsNumber: true })}
              className={errors.brewTime ? "border-red-500 pr-8" : "pr-8"}
            />
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <span className="text-sm text-muted-foreground">s</span>
            </div>
          </div>
          {errors.brewTime && (
            <p className="text-xs text-red-500">{errors.brewTime.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center space-x-1">
            <span>{t("Inputs.brew.yield.title")}</span>
            <span className="text-muted-foreground">
              ({t("Inputs.brew.yield.grams")})
            </span>
          </Label>
          <div className="space-y-4">
            <div className="relative pt-5">
              <Slider
                defaultValue={[defaultValue]}
                min={minValue}
                max={maxValue}
                step={0.5}
                onValueChange={(value) => {
                  setValue("yield", value[0]);
                  setCurrentYield(value[0]);
                }}
                className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              />
              <div className="absolute -top-2 left-0 right-0 flex justify-between text-xs text-muted-foreground">
                <span>1:{formatRatio(minValue)}</span>
                <span>1:{formatRatio(defaultValue)}</span>
                <span>1:{formatRatio(maxValue)}</span>
              </div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-sm">
                <span className="font-medium">
                  {currentYield}g (1:{formatRatio(currentYield)})
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                <span>
                  {t("Inputs.brew.yield.target")}: {defaultValue}g (1:
                  {formatRatio(defaultValue)})
                </span>
              </div>
            </div>
          </div>
          {errors.yield && (
            <p className="text-xs text-red-500">{errors.yield.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};
