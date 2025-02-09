import { FC } from "react";
import { Slider } from "@/components/ui/slider";
import { Scale } from "lucide-react";
import { UseFormSetValue } from "react-hook-form";
import { CalibrationFormData } from "@/lib/schemas/calibration";
import { useTranslations } from "next-intl";

interface TasteBalanceSectionProps {
  setValue: UseFormSetValue<CalibrationFormData>;
  currentValue: number;
}

export const TasteBalanceSection: FC<TasteBalanceSectionProps> = ({
  setValue,
  currentValue,
}) => {
  const t = useTranslations();

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Scale className="h-4 w-4" />
        <h3 className="font-medium">{t("Inputs.taste.title")}</h3>
      </div>
      <div className="space-y-4">
        <div className="relative pt-5">
          <Slider
            defaultValue={[currentValue]}
            min={-100}
            max={100}
            step={1}
            onValueChange={(value) => setValue("tasteBalance", value[0])}
          />
          <div className="absolute -top-2 left-0 right-0 flex justify-between text-xs text-muted-foreground">
            <span>{t("Inputs.taste.slider.sour")}</span>
            <span>{t("Inputs.taste.slider.balanced")}</span>
            <span>{t("Inputs.taste.slider.bitter")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
