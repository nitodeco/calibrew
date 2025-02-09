import { FC } from "react";
import { RoastLevelDialog } from "@/components/pages/calibration/dialogs/Roast";
import { GrinderDialog } from "@/components/pages/calibration/dialogs/Grinder";
import { WelcomeDialog } from "@/components/pages/calibration/dialogs/Welcome";
import {
  useRoastStore,
  useGrinderStore,
  useWelcomeStore,
} from "@/hooks/use-store";
import { RoastProfileCard } from "./partials/RoastSettings";
import { GrinderSettingsCard } from "./partials/GrinderSettings";
import { DialInForm } from "./partials/CalibrationForm";
import { CalibrationResults } from "./partials/Results";

export const CalibrationPage: FC = () => {
  const { hasSetInitialRoast, showRoastDialog, setShowRoastDialog } =
    useRoastStore();
  const { hasSetGrinder, showGrinderDialog, setShowGrinderDialog } =
    useGrinderStore();
  const { hasSeenWelcome, setHasSeenWelcome } = useWelcomeStore();

  const showMainContent = hasSetInitialRoast && hasSetGrinder;

  const showWelcomeDialog = !hasSeenWelcome;
  const showRoastSetup = hasSeenWelcome && !hasSetInitialRoast;
  const showGrinderSetup =
    hasSeenWelcome && hasSetInitialRoast && !hasSetGrinder;

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
        open={showRoastDialog || showRoastSetup}
        onOpenChange={(open) => setShowRoastDialog(open)}
      />
      <GrinderDialog
        open={showGrinderDialog || showGrinderSetup}
        onOpenChange={(open) => setShowGrinderDialog(open)}
      />

      {showMainContent && (
        <>
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RoastProfileCard />
              <GrinderSettingsCard />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <DialInForm />
              <CalibrationResults />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
