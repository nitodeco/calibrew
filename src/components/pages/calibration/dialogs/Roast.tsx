import { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useRoastStore } from "@/hooks/use-store";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

interface RoastLevelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RoastLevelDialog: FC<RoastLevelDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const t = useTranslations();
  const {
    roastLevel,
    dosageGrams,
    hasSetInitialRoast,
    setRoastLevel,
    setDosageGrams,
    setHasSetInitialRoast,
  } = useRoastStore();

  const handleContinue = () => {
    setHasSetInitialRoast(true);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("Dialogs.Roast.title")}</DialogTitle>
          <DialogDescription>{t("Dialogs.Roast.description")}</DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("Dialogs.Roast.level.title")}
              </label>
              <div className="space-y-4">
                <Slider
                  value={[roastLevel]}
                  onValueChange={(value) => setRoastLevel(value[0])}
                  max={100}
                  step={5}
                  className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{t("Dialogs.Roast.level.light")}</span>
                  <span>{t("Dialogs.Roast.level.medium")}</span>
                  <span>{t("Dialogs.Roast.level.dark")}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t("Dialogs.Roast.dosage.title")}
              </label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Slider
                    value={[dosageGrams]}
                    onValueChange={(value) => setDosageGrams(value[0])}
                    min={4}
                    max={36}
                    step={1}
                    className="flex-1 [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                  />
                  <Input
                    type="number"
                    value={dosageGrams}
                    onChange={(e) => setDosageGrams(Number(e.target.value))}
                    className="w-20"
                    min={4}
                    max={36}
                    step={0.1}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleContinue}>{t("Dialogs.Roast.continue")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
