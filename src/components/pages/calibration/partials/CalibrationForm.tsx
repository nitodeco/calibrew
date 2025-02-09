import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CoffeeIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  calibrationSchema,
  type CalibrationFormData,
} from "@/lib/schemas/calibration";
import { GrindDoseSection } from "./GrindInput";
import { BrewParametersSection } from "./BrewInput";
import { TasteBalanceSection } from "./TasteInput";
import {
  useRoastStore,
  useGrinderStore,
  useCalibrationStore,
} from "@/hooks/use-store";
import { calculateCalibration } from "@/app/actions/calibration";
import { useTranslations } from "next-intl";

export const DialInForm: FC = () => {
  const { roastLevel } = useRoastStore();
  const { grindSetting } = useGrinderStore();
  const { setCalibrationResult } = useCalibrationStore();
  const t = useTranslations();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CalibrationFormData>({
    resolver: zodResolver(calibrationSchema),
    defaultValues: {
      tasteBalance: 50,
      roastLevel: roastLevel,
      grindSize: 15,
      dose: 18,
      brewTime: 30,
      yield: 36,
    },
  });

  const tasteBalance = watch("tasteBalance", 50);

  const onSubmit = handleSubmit(async (data: CalibrationFormData) => {
    if (!grindSetting) {
      alert("Please configure your grinder settings first.");
      return;
    }

    try {
      console.log("Form data:", data);
      console.log("Grind setting:", grindSetting);
      const calibrationResult = await calculateCalibration(
        { ...data, roastLevel },
        grindSetting
      );
      console.log("Calibration result:", calibrationResult);
      setCalibrationResult(calibrationResult, { ...data, roastLevel });
    } catch (error) {
      console.error("Calibration error:", error);
      alert("Failed to calculate calibration. Please check your inputs.");
    }
  });

  return (
    <Card className="h-full">
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <CoffeeIcon className="h-5 w-5" />
          <CardTitle>{t("Inputs.title")}</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">{t("Inputs.header")}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <GrindDoseSection
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
          <Separator />
          <BrewParametersSection
            register={register}
            errors={errors}
            setValue={setValue}
          />
          <Separator />
          <TasteBalanceSection
            setValue={setValue}
            currentValue={tasteBalance}
          />
          <Button type="submit" size="lg" className="w-full mt-4">
            <CoffeeIcon className="mr-2 h-4 w-4" />
            {t("Inputs.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
