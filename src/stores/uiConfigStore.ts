import { create } from "zustand";

interface UiConfigState {
  theme: "light" | "dark";
  layout: "compact" | "spacious";
  showTooltips: boolean;
  sidebarOpen: boolean;
  showCarImage: boolean;
  showUssZones: boolean;
  showUssSensors: boolean;
  showLidarSensors: boolean;
  showRadarSensors: boolean;
  showCameraSensors: boolean;
  showVehicleRefPoint: boolean;
  showDebugMode: boolean;
  showGrid: boolean;
  frontZones: number;
  sideZones: number;
  rearZones: number;
  setTheme: (theme: "light" | "dark") => void;
  toggleGrid: () => void;
  setLayout: (layout: "compact" | "spacious") => void;
  toggleTooltips: () => void;
  toggleSidebar: () => void;
  toggleCarImage: () => void;
  toggleUssZones: () => void;
  toggleUssSensors: () => void;
  toggleLidarSensors: () => void;
  toggleRadarSensors: () => void;
  toggleCameraSensors: () => void;
  toggleVehicleRefPoint: () => void;
  toggleDebugModePoint: () => void;
  setFrontZones: (value: number) => void;
  setSideZones: (value: number) => void;
  setRearZones: (value: number) => void;
}

const useUiConfigStore = create<UiConfigState>((set) => ({
  theme: "light",
  layout: "compact",
  showTooltips: true,
  sidebarOpen: true,
  showCarImage: true,
  showUssZones: false,
  showUssSensors: true,
  showLidarSensors: true,
  showRadarSensors: true,
  showCameraSensors: true,
  showVehicleRefPoint: true,
  showDebugMode: false,
  showGrid: false,
  frontZones: 8,
  sideZones: 5,
  rearZones: 8,
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  setTheme: (theme) => set({ theme }),
  setLayout: (layout) => set({ layout }),
  toggleTooltips: () => set((state) => ({ showTooltips: !state.showTooltips })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleCarImage: () => set((state) => ({ showCarImage: !state.showCarImage })),
  toggleUssZones: () => set((state) => ({ showUssZones: !state.showUssZones })),
  toggleUssSensors: () =>
    set((state) => ({ showUssSensors: !state.showUssSensors })),
  toggleLidarSensors: () =>
    set((state) => ({ showLidarSensors: !state.showLidarSensors })),
  toggleRadarSensors: () =>
    set((state) => ({ showRadarSensors: !state.showRadarSensors })),
  toggleCameraSensors: () =>
    set((state) => ({ showCameraSensors: !state.showCameraSensors })),
  toggleVehicleRefPoint: () =>
    set((state) => ({ showVehicleRefPoint: !state.showVehicleRefPoint })),
  toggleDebugModePoint: () =>
    set((state) => ({ showDebugMode: !state.showDebugMode })),

  setFrontZones: (value) => set({ frontZones: value }),
  setSideZones: (value) => set({ sideZones: value }),
  setRearZones: (value) => set({ rearZones: value }),
}));

export default useUiConfigStore;
