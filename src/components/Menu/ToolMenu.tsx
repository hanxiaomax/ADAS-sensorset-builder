import React, { useState } from "react";
import { Menu, MenuItem, Button } from "@mui/material";
import Sensor from "../../types/Sensor";
import { BomTableDialog } from "../Dialogs/BomTableDialog";

const ToolMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [bomTableDialogOpen, setBomTableDialogOpen] = useState<boolean>(false);

  // 打开菜单
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // 关闭菜单
  const handleClose = () => {
    setAnchorEl(null);
  };

  // 打开spec对话框
  const handleBomTableDialogOpen = () => {
    setBomTableDialogOpen(true);
  };

  // 从 localStorage 加载 sensorConfig 数据
  const loadSensorConfig = (): Sensor[] => {
    const sensorConfig = JSON.parse(
      localStorage.getItem("sensorConfig") || "[]"
    );
    return sensorConfig;
  };

  return (
    <>
      <Button
        aria-label="tools menu"
        aria-controls="tools-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        Tools
      </Button>

      <Menu
        id="tools-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleBomTableDialogOpen}>
          Create Sensor BOM
        </MenuItem>
      </Menu>

      <BomTableDialog
        open={bomTableDialogOpen}
        setBomTableDialogOpen={setBomTableDialogOpen}
        sensors={loadSensorConfig()}
      />
    </>
  );
};

export default ToolMenu;
