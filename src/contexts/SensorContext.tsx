// contexts/SensorContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { SensorStocks } from "../types/Common";
import Sensor from "../types/Sensor";
import notifier from "../components/Helper/Notification";
interface SensorContextType {
  sensorConfiguration: Sensor[];
  setSensorConfiguration: React.Dispatch<React.SetStateAction<Sensor[]>>;
  sensorStocks: SensorStocks;
  setSensorStocks: React.Dispatch<React.SetStateAction<SensorStocks>>;
}

const SensorContext = createContext<SensorContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SENSOR_CONFIG: "sensorConfig",
  SENSOR_STOCKS: "sensorStocks",
};

export const SensorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize state with stored data
  const [sensorConfiguration, setSensorConfiguration] = useState<Sensor[]>(
    () => {
      try {
        const storedConfig = localStorage.getItem(STORAGE_KEYS.SENSOR_CONFIG);
        if (storedConfig) {
          const parsedConfig = JSON.parse(storedConfig);
          return parsedConfig.map(
            (sensorData: any) =>
              new Sensor(
                sensorData.id,
                sensorData.sensorInfo,
                sensorData.mountPosition,
                sensorData.options
              )
          );
        }
        return [];
      } catch (error) {
        notifier.error("Error loading sensor configuration: " + error);
        return [];
      }
    }
  );

  const [sensorStocks, setSensorStocks] = useState<SensorStocks>(() => {
    try {
      const storedStocks = localStorage.getItem(STORAGE_KEYS.SENSOR_STOCKS);
      return storedStocks ? JSON.parse(storedStocks) : {};
    } catch (error) {
      notifier.error("Error loading sensor stocks: " + error);
      return {};
    }
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.SENSOR_CONFIG,
        JSON.stringify(sensorConfiguration)
      );
    } catch (error) {
      notifier.error("Error saving sensor configuration: " + error);
    }
  }, [sensorConfiguration]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.SENSOR_STOCKS,
        JSON.stringify(sensorStocks)
      );
    } catch (error) {
      notifier.error("Error saving sensor stocks: " + error);
    }
  }, [sensorStocks]);

  // Listen for storage events from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEYS.SENSOR_CONFIG && event.newValue) {
        try {
          const parsedConfig = JSON.parse(event.newValue);
          setSensorConfiguration(
            parsedConfig.map(
              (sensorData: any) =>
                new Sensor(
                  sensorData.id,
                  sensorData.sensorInfo,
                  sensorData.mountPosition,
                  sensorData.options
                )
            )
          );
        } catch (error) {
          notifier.error(
            "Error processing storage change for sensor config: " + error
          );
        }
      } else if (event.key === STORAGE_KEYS.SENSOR_STOCKS && event.newValue) {
        try {
          setSensorStocks(JSON.parse(event.newValue));
        } catch (error) {
          notifier.error(
            "Error processing storage change for sensor stocks: " + error
          );
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <SensorContext.Provider
      value={{
        sensorConfiguration,
        setSensorConfiguration,
        sensorStocks,
        setSensorStocks,
      }}
    >
      {children}
    </SensorContext.Provider>
  );
};

export const useSensor = () => {
  const context = useContext(SensorContext);
  if (context === undefined) {
    throw new Error("useSensor must be used within a SensorProvider");
  }
  return context;
};
