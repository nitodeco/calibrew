"use server";

import {
  calibrationSchema,
  type CalibrationFormData,
  type CalibrationResult,
} from "@/lib/schemas/calibration";
import { GrindSetting } from "@/types/grind";

interface AdjustmentRange {
  min: number;
  max: number;
  defaultStep: number;
}

const getAdjustmentRange = (grindSetting: GrindSetting): AdjustmentRange => {
  switch (grindSetting.type) {
    case "absolute":
      // For absolute numbers, use conservative steps based on step size
      return {
        min: grindSetting.stepSize,
        max: grindSetting.stepSize * 3, // Max 3 steps
        defaultStep: grindSetting.stepSize,
      };
    case "stepped":
      if (grindSetting.unit === "numbers") {
        const range =
          (grindSetting.maxValue as number) - (grindSetting.minValue as number);
        // For numbered steps, use at most 20% of the total range
        return {
          min: 1,
          max: Math.max(1, Math.floor(range * 0.2)),
          defaultStep: 1,
        };
      } else {
        // For lettered steps (like A-Z), use single step adjustments
        return {
          min: 1,
          max: 1,
          defaultStep: 1,
        };
      }
    case "clicks":
      // For click-based grinders, allow for more granular adjustments
      return {
        min: 1,
        max: 4, // Most click grinders can handle 4 clicks adjustment
        defaultStep: 1,
      };
  }
};

const calculateGrindAdjustment = (
  tasteBalance: number,
  yieldRatio: number,
  grindSetting: GrindSetting
): { direction: "finer" | "coarser"; steps: number } => {
  const range = getAdjustmentRange(grindSetting);

  // Initialize base direction from taste (primary factor)
  const needsFiner = tasteBalance < 50;
  let adjustmentMagnitude = 0;

  // Calculate taste-based adjustment magnitude (0-1 scale)
  const tasteDeviation = Math.abs(tasteBalance - 50) / 50; // Normalized to 0-1
  adjustmentMagnitude += tasteDeviation;

  // Calculate yield-based adjustment magnitude (0-1 scale)
  const targetRatio = 2;
  const yieldDeviation = Math.abs(yieldRatio - targetRatio) / targetRatio;
  adjustmentMagnitude += yieldDeviation * 0.5; // Yield has 50% weight of taste

  // Scale the adjustment magnitude to actual steps
  const rawSteps = adjustmentMagnitude * range.max;
  const steps = Math.max(
    range.min,
    Math.min(
      range.max,
      Math.round(rawSteps / range.defaultStep) * range.defaultStep
    )
  );

  return {
    direction: needsFiner ? "finer" : "coarser",
    steps,
  };
};

const formatGrindAdjustment = (
  direction: "finer" | "coarser",
  steps: number,
  grindSetting: GrindSetting
): string => {
  switch (grindSetting.type) {
    case "absolute":
      return `Adjust grinder ${direction} by ${steps} ${
        steps === 1 ? "point" : "points"
      }`;
    case "stepped":
      if (grindSetting.unit === "numbers") {
        return `Move ${direction === "finer" ? "down" : "up"} ${steps} number${
          steps === 1 ? "" : "s"
        }`;
      } else {
        return `Move ${direction === "finer" ? "down" : "up"} ${steps} letter${
          steps === 1 ? "" : "s"
        }`;
      }
    case "clicks":
      return `Turn ${direction === "finer" ? "right" : "left"} ${steps} click${
        steps === 1 ? "" : "s"
      }`;
  }
};

export async function calculateCalibration(
  data: CalibrationFormData,
  grindSetting: GrindSetting
): Promise<CalibrationResult> {
  const { tasteBalance, dose, yield: actualYield } = data;
  const yieldRatio = actualYield / dose;

  // Calculate grind adjustment based on taste and yield
  const { direction, steps } = calculateGrindAdjustment(
    tasteBalance,
    yieldRatio,
    grindSetting
  );

  // Generate the grind adjustment recommendation
  const grindAdjustment = formatGrindAdjustment(direction, steps, grindSetting);

  // Generate explanation based on both taste and yield
  let explanation = "";

  // Add taste-based explanation
  if (Math.abs(tasteBalance - 50) > 10) {
    explanation = `Your shot is too ${
      direction === "finer" ? "sour" : "bitter"
    }. ${grindAdjustment} to achieve better extraction.`;
  }

  // Add yield-based explanation
  if (Math.abs(yieldRatio - 2) > 0.2) {
    const yieldExplanation = ` Your yield ratio of ${yieldRatio.toFixed(
      1
    )}x is ${
      yieldRatio > 2 ? "higher" : "lower"
    } than the target of 2x your dose.`;

    explanation = explanation
      ? `${explanation}${yieldExplanation}`
      : yieldExplanation;
  }

  if (!explanation) {
    explanation =
      "Your shot is well balanced. Keep these parameters for consistent results.";
  }

  return {
    grindAdjustment,
    doseAdjustment: "Keep your dose consistent",
    yieldAdjustment: "Target a 1:2 ratio (yield should be 2x your dose)",
    brewTimeTarget: "Observe and note the brew time with the new grind setting",
    explanation,
  };
}

function getNormalizedGrindSetting(
  previousGrind: number,
  tasteDelta: number,
  dose: number,
  yieldGrams: number,
  brewTime: number,
  k: number = 30 // adjust k based on experience
): number {
  const adjustment = k * tasteDelta * (yieldGrams / (dose * brewTime));
  let nextGrind = previousGrind + adjustment;

  nextGrind = Math.max(0, Math.min(1, nextGrind));
  return nextGrind;
}

function denormalizeGrindSetting(
  min: number,
  max: number,
  normalized: number
): number {
  return min + (max - min) * normalized;
}
