import { create } from "zustand";
import { GrindSetting, GrindType, GrindUnit } from "@/types/grind";
import {
  CalibrationResult,
  CalibrationFormData,
} from "@/lib/schemas/calibration";

interface WelcomeState {
  hasSeenWelcome: boolean;
  setHasSeenWelcome: (value: boolean) => void;
}

interface RoastState {
  roastLevel: number;
  dosageGrams: number;
  hasSetInitialRoast: boolean;
  showRoastDialog: boolean;
  setRoastLevel: (level: number) => void;
  setDosageGrams: (grams: number) => void;
  setHasSetInitialRoast: (value: boolean) => void;
  setShowRoastDialog: (show: boolean) => void;
}

interface GrinderState {
  grindSetting: GrindSetting | null;
  hasSetGrinder: boolean;
  showGrinderDialog: boolean;
  reverseScale: boolean;
  setGrindSetting: (setting: GrindSetting) => void;
  setHasSetGrinder: (value: boolean) => void;
  setShowGrinderDialog: (show: boolean) => void;
  setReverseScale: (reverse: boolean) => void;
}

interface CalibrationHistoryEntry extends CalibrationResult {
  formData: CalibrationFormData;
}

interface CalibrationState {
  calibrationResult: CalibrationResult | null;
  calibrationHistory: CalibrationHistoryEntry[];
  setCalibrationResult: (
    result: CalibrationResult | null,
    formData?: CalibrationFormData
  ) => void;
}

export type { CalibrationHistoryEntry };

export const useWelcomeStore = create<WelcomeState>((set) => ({
  hasSeenWelcome: false,
  setHasSeenWelcome: (value) => set({ hasSeenWelcome: value }),
}));

export const useRoastStore = create<RoastState>((set) => ({
  roastLevel: 50,
  dosageGrams: 18,
  hasSetInitialRoast: false,
  showRoastDialog: false,
  setRoastLevel: (level) => set({ roastLevel: level }),
  setDosageGrams: (grams) => set({ dosageGrams: grams }),
  setHasSetInitialRoast: (value) => set({ hasSetInitialRoast: value }),
  setShowRoastDialog: (show) => set({ showRoastDialog: show }),
}));

export const useGrinderStore = create<GrinderState>((set) => ({
  grindSetting: null,
  hasSetGrinder: false,
  showGrinderDialog: false,
  reverseScale: false,
  setGrindSetting: (setting) => set({ grindSetting: setting }),
  setHasSetGrinder: (value) => set({ hasSetGrinder: value }),
  setShowGrinderDialog: (show) => set({ showGrinderDialog: show }),
  setReverseScale: (reverse) => set({ reverseScale: reverse }),
}));

export const useCalibrationStore = create<CalibrationState>((set) => ({
  calibrationResult: null,
  calibrationHistory: [],
  setCalibrationResult: (result, formData) =>
    set((state) => {
      if (!result || !formData) {
        return { calibrationResult: result };
      }

      const newEntry: CalibrationHistoryEntry = {
        ...result,
        formData,
      };

      return {
        calibrationResult: result,
        calibrationHistory: [newEntry, ...state.calibrationHistory].slice(
          0,
          10
        ), // Keep last 10 entries
      };
    }),
}));
