import { create } from "zustand";

export interface VehicleImageState {
  // Vehicle image map
  vehicleImages: { [key: string]: HTMLImageElement };
  currentVehicleImageKey: string | null;

  // Actions
  addVehicleImage: (key: string, image: HTMLImageElement) => void;
  setCurrentVehicleImage: (key: string) => void;
  getCurrentVehicleImage: () => HTMLImageElement | undefined;
}

export const useVehicleImageStore = create<VehicleImageState>()((set, get) => ({
  vehicleImages: {},
  currentVehicleImageKey: null,

  addVehicleImage: (key, image) =>
    set((state) => ({
      vehicleImages: { ...state.vehicleImages, [key]: image },
    })),

  setCurrentVehicleImage: (key) =>
    set(() => ({
      currentVehicleImageKey: key,
    })),

  getCurrentVehicleImage: () => {
    const state = get();
    if (!state.currentVehicleImageKey) return undefined;
    return state.vehicleImages[state.currentVehicleImageKey];
  },
}));
