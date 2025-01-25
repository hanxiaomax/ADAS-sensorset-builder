import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { SensorStocks } from "../types/Common";
import Sensor from "../types/Sensor";
import notifier from "../components/Helper/Notification";

export interface SensorStoreState {
  sensorConfiguration: Sensor[];
  sensorStocks: SensorStocks;
  setSensorConfiguration: (config: Sensor[]) => void;
  setSensorStocks: (stocks: SensorStocks) => void;
}

const STORAGE_KEYS = {
  SENSOR_CONFIG: "sensorConfig",
  SENSOR_STOCKS: "sensorStocks",
};

export const useSensorStore = create<SensorStoreState>()(
  persist(
    (set) => ({
      sensorConfiguration: [],
      sensorStocks: {},
      setSensorConfiguration: (config) => set({ sensorConfiguration: config }),
      setSensorStocks: (stocks) => set({ sensorStocks: stocks }),
    }),
    {
      name: "sensor-store",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Handle localStorage errors during rehydration
          try {
            const storedConfig = localStorage.getItem(
              STORAGE_KEYS.SENSOR_CONFIG
            );
            if (storedConfig) {
              state.sensorConfiguration = JSON.parse(storedConfig).map(
                (sensorData: any) =>
                  new Sensor(
                    sensorData.id,
                    sensorData.sensorInfo,
                    sensorData.mountPosition,
                    sensorData.options
                  )
              );
            }

            const storedStocks = localStorage.getItem(
              STORAGE_KEYS.SENSOR_STOCKS
            );
            if (storedStocks) {
              state.sensorStocks = JSON.parse(storedStocks);
            }
          } catch (error) {
            notifier.error("Error rehydrating sensor store: " + error);
          }
        }
      },
    }
  )
);

// Cross-tab synchronization
window.addEventListener("storage", (event) => {
  if (event.key === STORAGE_KEYS.SENSOR_CONFIG && event.newValue) {
    try {
      const parsedConfig = JSON.parse(event.newValue);
      useSensorStore.setState({
        sensorConfiguration: parsedConfig.map(
          (sensorData: any) =>
            new Sensor(
              sensorData.id,
              sensorData.sensorInfo,
              sensorData.mountPosition,
              sensorData.options
            )
        ),
      });
    } catch (error) {
      notifier.error(
        "Error processing storage change for sensor config: " + error
      );
    }
  } else if (event.key === STORAGE_KEYS.SENSOR_STOCKS && event.newValue) {
    try {
      useSensorStore.setState({ sensorStocks: JSON.parse(event.newValue) });
    } catch (error) {
      notifier.error(
        "Error processing storage change for sensor stocks: " + error
      );
    }
  }
});
