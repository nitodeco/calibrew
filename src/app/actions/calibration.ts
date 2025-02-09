"use server";

import {
  calibrationSchema,
  type CalibrationFormData,
  type CalibrationResult,
} from "@/lib/schemas/calibration";
import { GrindSetting } from "@/types/grind";

type RoastCategory = "light" | "medium" | "dark";

const getRoastCategory = (roastLevel: number): RoastCategory => {
  if (roastLevel <= 33) return "light";
  if (roastLevel <= 66) return "medium";
  return "dark";
};

const formatGrindAdjustment = (
  direction: "finer" | "coarser",
  amount: number,
  grindSetting: GrindSetting
): string => {
  switch (grindSetting.type) {
    case "absolute":
      return `Adjust grinder ${direction} by ${
        amount * grindSetting.stepSize
      } ${grindSetting.stepSize === 1 ? "step" : "steps"}`;
    case "stepped":
      if (grindSetting.unit === "numbers") {
        return `Move ${direction === "finer" ? "down" : "up"} ${amount} number${
          amount === 1 ? "" : "s"
        }`;
      } else {
        return `Move ${direction === "finer" ? "down" : "up"} ${amount} letter${
          amount === 1 ? "" : "s"
        }`;
      }
    case "clicks":
      return `Turn ${direction === "finer" ? "right" : "left"} ${amount} click${
        amount === 1 ? "" : "s"
      }`;
  }
};

export async function calculateCalibration(
  data: CalibrationFormData,
  grindSetting: GrindSetting
): Promise<CalibrationResult> {
  const roastCategory = getRoastCategory(data.roastLevel);

  // Determine base adjustments based on roast category
  const baseAdjustments = {
    light: { grindFiner: true, longerRatio: true },
    medium: { grindFiner: false, longerRatio: false },
    dark: { grindFiner: false, longerRatio: false },
  }[roastCategory];

  // Calculate adjustments based on taste balance
  const tasteBalance = data.tasteBalance;
  const isTooSour = tasteBalance < 40;
  const isTooBitter = tasteBalance > 60;

  let grindAdjustment = "";
  let doseAdjustment = "";
  let yieldAdjustment = "";
  let brewTimeTarget = "";
  let explanation = "";

  if (isTooSour) {
    grindAdjustment = formatGrindAdjustment("finer", 2, grindSetting);
    doseAdjustment = "Keep current dose";
    yieldAdjustment = baseAdjustments.longerRatio
      ? "Increase yield by 2g"
      : "Keep current yield";
    brewTimeTarget = "Aim for 28-32 seconds";
    explanation =
      "Your shot is too sour. Grinding finer will increase extraction and reduce acidity.";
  } else if (isTooBitter) {
    grindAdjustment = formatGrindAdjustment("coarser", 2, grindSetting);
    doseAdjustment = "Keep current dose";
    yieldAdjustment = "Reduce yield by 2g";
    brewTimeTarget = "Aim for 25-28 seconds";
    explanation =
      "Your shot is too bitter. Grinding coarser will decrease extraction and reduce bitterness.";
  } else {
    grindAdjustment = "Keep current grind setting";
    doseAdjustment = "Keep current dose";
    yieldAdjustment = "Keep current yield";
    brewTimeTarget = "Keep current brew time";
    explanation =
      "Your shot is well balanced. Keep these parameters for consistent results.";
  }

  return {
    grindAdjustment,
    doseAdjustment,
    yieldAdjustment,
    brewTimeTarget,
    explanation,
  };
}
