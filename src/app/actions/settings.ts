import type { Range } from "@/types/generic";

export function calculateYieldRange(dose: number): Range {
  const desiredYield = dose * 2;
  return {
    min: dose,
    max: desiredYield * 1.5,
    default: desiredYield,
  };
}
