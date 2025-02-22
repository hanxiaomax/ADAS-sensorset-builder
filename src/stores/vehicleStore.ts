import { create } from "zustand";
import { Vehicle } from "../types/Vehicle";

export interface VehicleState {
  // Vehicle instance
  currentVehicle: Vehicle | null;

  // Actions
  setCurrentVehicle: (vehicle: Vehicle) => void;
  updateVehicleImage: (image: HTMLImageElement) => void;
}

export const useVehicleStore = create<VehicleState>()((set) => ({
  currentVehicle: null,

  setCurrentVehicle: (vehicle) =>
    set(() => ({
      currentVehicle: vehicle,
    })),

  updateVehicleImage: (image) =>
    set((state) => {
      if (state.currentVehicle) {
        state.currentVehicle.setImage(image);
        return { currentVehicle: state.currentVehicle };
      }
      return state;
    }),
}));
