import { Plugin } from "../types/Plugin";

// 示例插件
const ExamplePlugin: Plugin = {
  id: "example",
  name: "Example Plugin",
  component: () => <div>Example Plugin</div>,
};

const plugins: Plugin[] = [ExamplePlugin];

export default plugins;
