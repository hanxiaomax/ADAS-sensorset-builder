import React, { useEffect } from "react";
import SensorSetBuilderMain from "./main";
// import { SnackbarProvider } from "./components/SnackbarContext";
import { SnackbarProvider } from "notistack";
import { migrateDataToSceneStore } from "./stores/sceneStore";

const App: React.FC = () => {
  useEffect(() => {
    // 在应用启动时执行数据迁移
    migrateDataToSceneStore();
  }, []);

  return (
    <SnackbarProvider maxSnack={4} autoHideDuration={5000}>
      <SensorSetBuilderMain />
    </SnackbarProvider>
  );
};

export default App;
