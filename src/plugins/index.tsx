import { Plugin } from "../types/Plugin";
import SensorSetBuilder from "./sensor-set-builder";
// 示例插件

const SensorSetBuilderMain: Plugin = {
  id: "sensor-set-builder",
  name: "Sensor Set Builder",
  component: SensorSetBuilder,
};

const plugins: Plugin[] = [SensorSetBuilderMain];

export default plugins;
