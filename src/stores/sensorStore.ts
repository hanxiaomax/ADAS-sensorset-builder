import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { SensorItem, SensorStocks } from "../types/Common";
import { Sensor } from "../types/Sensor";
import notifier from "../components/Helper/Notification";

export interface SensorStoreState {
  sensorStocks: SensorStocks;
  sensorConfiguration: Sensor[];
  setSensorStocks: (stocks: SensorStocks) => void;
  setSensorConfiguration: (config: Sensor[]) => void;
  importSensorConfiguration: (configData: string) => void;
}

const STORAGE_KEYS = {
  SENSOR_CONFIG: "sensorConfig",
  SENSOR_STOCKS: "sensorStocks",
};

export const useSensorStore = create<SensorStoreState>()(
  persist(
    (set, get) => ({
      sensorStocks: {},
      sensorConfiguration: [],
      setSensorStocks: (stocks) => set({ sensorStocks: stocks }),
      setSensorConfiguration: (config) => set({ sensorConfiguration: config }),
      importSensorConfiguration: (configData) => {
        try {
          const storedConfig = localStorage.getItem(configData);
          if (storedConfig) {
            set((state) => {
              state.sensorConfiguration = JSON.parse(storedConfig).map(
                (sensorData: any) =>
                  new Sensor(
                    sensorData.id,
                    sensorData.sensorInfo,
                    sensorData.mountPosition,
                    sensorData.options
                  )
              );
              return state;
            });
          }
        } catch (error) {
          console.error("Error importing sensor configuration:", error);
        }
      },
    }),
    {
      name: "sensor-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sensorStocks: state.sensorStocks,
        sensorConfiguration: state.sensorConfiguration.map((sensor) => ({
          id: sensor.id,
          sensorInfo: sensor.sensorInfo,
          mountPosition: sensor.mountPosition,
          options: sensor.options,
        })),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const parsedConfig = state.sensorConfiguration;
          state.sensorConfiguration = parsedConfig.map(
            (sensorData: any) =>
              new Sensor(
                sensorData.id,
                sensorData.sensorInfo,
                sensorData.mountPosition,
                sensorData.options
              )
          );
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
