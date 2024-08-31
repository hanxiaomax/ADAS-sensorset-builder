import React from "react";
import { AppBar, ButtonGroup } from "@mui/material";
import ProfileMenu from "../components/ProfileMenu";
import ViewMenu from "../components/ViewMenu";

interface MenuBarProps {
  handleSensorSetConfigImport: (data: any) => void;
  handleSensorStockImport: (data: any) => void;
  handleExport: () => void;
  uiConfig: any;
  setUiConfig: (config: any) => void;
}

const MenuBar: React.FC<MenuBarProps> = ({
  handleSensorSetConfigImport,
  handleSensorStockImport,
  handleExport,
  uiConfig,
  setUiConfig,
}) => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "#ffffff",
      }}
    >
      <ButtonGroup
        disableElevation
        variant="text"
        size="large"
        sx={{
          "& .MuiButtonBase-root": {
            borderColor: "#f6f6f6",
            color: "#146276",
            borderRadius: 0,
            fontWeight: "bold", // 设置字体为粗体
            textTransform: "none", // 禁用大写转换
            "&:hover": {
              backgroundColor: "#0c7a92",
              color: "white",
            },
          },
        }}
      >
        <ProfileMenu
          onImportSensorSetConfigImport={handleSensorSetConfigImport}
          onImportSensorStock={handleSensorStockImport}
          onExport={handleExport}
        />
        <ViewMenu uiConfig={uiConfig} setUiConfig={setUiConfig} />
      </ButtonGroup>
    </AppBar>
  );
};

export default MenuBar;
