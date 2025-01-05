// contexts/UiConfigContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface UiConfig {
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
  rearZones: number;
  sideZones: number;
  panelVisible: boolean;
  background: string;
}

interface UiConfigContextType {
  uiConfig: UiConfig;
  setUiConfig: React.Dispatch<React.SetStateAction<UiConfig>>;
}

const UiConfigContext = createContext<UiConfigContextType | undefined>(
  undefined
);

const defaultUiConfig: UiConfig = {
  showCarImage: true,
  showUssZones: false,
  showUssSensors: true,
  showLidarSensors: true,
  showRadarSensors: true,
  showCameraSensors: true,
  showVehicleRefPoint: false,
  showDebugMode: false,
  showGrid: true,
  frontZones: 6,
  rearZones: 4,
  sideZones: 6,
  panelVisible: false,
  background: "white",
};

export const UiConfigProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [uiConfig, setUiConfig] = useState<UiConfig>(defaultUiConfig);

  return (
    <UiConfigContext.Provider value={{ uiConfig, setUiConfig }}>
      {children}
    </UiConfigContext.Provider>
  );
};

export const useUiConfig = () => {
  const context = useContext(UiConfigContext);
  if (context === undefined) {
    throw new Error("useUiConfig must be used within a UiConfigProvider");
  }
  return context;
};
