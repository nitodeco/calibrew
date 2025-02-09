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

interface RoastLevelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RoastLevelDialog: FC<RoastLevelDialogProps> = ({
  open,
  onOpenChange,
}) => {
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
          <DialogTitle>Roast</DialogTitle>
          <DialogDescription>
            Let's start by setting your coffee's roast level and dosage. You can
            find the roast level information on the packaging of your coffee
            beans.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Roast Level</label>
              <div className="space-y-4">
                <Slider
                  value={[roastLevel]}
                  onValueChange={(value) => setRoastLevel(value[0])}
                  max={100}
                  step={5}
                  className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Light</span>
                  <span>Medium</span>
                  <span>Dark</span>
                </div>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                {roastLevel <= 33 && "Bright, acidic, with subtle flavors"}
                {roastLevel > 33 &&
                  roastLevel <= 66 &&
                  "Balanced, with caramel notes"}
                {roastLevel > 66 && "Bold, rich, with chocolate notes"}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Dose (grams)</label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Slider
                    value={[dosageGrams]}
                    onValueChange={(value) => setDosageGrams(value[0])}
                    min={14}
                    max={24}
                    step={1}
                    className="flex-1 [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                  />
                  <Input
                    type="number"
                    value={dosageGrams}
                    onChange={(e) => setDosageGrams(Number(e.target.value))}
                    className="w-20"
                    min={14}
                    max={24}
                    step={0.1}
                  />
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  {dosageGrams < 16 && "Light dose - suited for lighter roasts"}
                  {dosageGrams >= 16 &&
                    dosageGrams <= 19 &&
                    "Standard dose - balanced extraction"}
                  {dosageGrams > 19 &&
                    "Heavy dose - intense flavor, slower extraction"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleContinue}>Continue</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
