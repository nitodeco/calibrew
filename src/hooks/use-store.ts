import { create } from "zustand";
import { GrindSetting, GrindType, GrindUnit } from "@/types/grind";

interface WelcomeState {
  hasSeenWelcome: boolean;
  setHasSeenWelcome: (value: boolean) => void;
}

interface RoastState {
  roastLevel: number;
  dosageGrams: number;
  hasSetInitialRoast: boolean;
  setRoastLevel: (level: number) => void;
  setDosageGrams: (grams: number) => void;
  setHasSetInitialRoast: (value: boolean) => void;
}

interface GrinderState {
  grindSetting: GrindSetting | null;
  hasSetGrinder: boolean;
  setGrindSetting: (setting: GrindSetting) => void;
  setHasSetGrinder: (value: boolean) => void;
}

export const useWelcomeStore = create<WelcomeState>((set) => ({
  hasSeenWelcome: false,
  setHasSeenWelcome: (value) => set({ hasSeenWelcome: value }),
}));

export const useRoastStore = create<RoastState>((set) => ({
  roastLevel: 50,
  dosageGrams: 18,
  hasSetInitialRoast: false,
  setRoastLevel: (level) => set({ roastLevel: level }),
  setDosageGrams: (grams) => set({ dosageGrams: grams }),
  setHasSetInitialRoast: (value) => set({ hasSetInitialRoast: value }),
}));

export const useGrinderStore = create<GrinderState>((set) => ({
  grindSetting: null,
  hasSetGrinder: false,
  setGrindSetting: (setting) => set({ grindSetting: setting }),
  setHasSetGrinder: (value) => set({ hasSetGrinder: value }),
}));
