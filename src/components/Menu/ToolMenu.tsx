import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import BomTable from "./BomTable"; // 引入表格组件
import html2canvas from "html2canvas";
import Sensor from "../../types/Sensor";

const ToolMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [specPageOpen, setSpecPageOpen] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]); // 保存选中的行数据

  // 打开菜单
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // 关闭菜单
  const handleClose = () => {
    setAnchorEl(null);
  };

  // 打开spec对话框
  const handleSpecPageOpen = () => {
    setSpecPageOpen(true);
  };

  // 关闭spec对话框
  const handleSpecPageClose = () => {
    setSpecPageOpen(false);
  };

  // 生成图片
  const handleGenerateImage = () => {
    const tableElement = document.getElementById("selectedTable");
    if (tableElement) {
      html2canvas(tableElement).then((canvas) => {
        const link = document.createElement("a");
        link.download = "selected_table_snapshot.png"; // 图片文件名
        link.href = canvas.toDataURL();
        link.click();
      });
    }
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
        <MenuItem onClick={handleSpecPageOpen}>Create Sensor BOM</MenuItem>
      </Menu>

      <Dialog
        open={specPageOpen}
        onClose={handleSpecPageClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Sensor BOM</DialogTitle>
        <DialogContent>
          {/* 将选中的行通过setSelectedRows传递给BomTable */}
          <BomTable
            sensorData={loadSensorConfig()} // 传递 sensorConfig 数据
            setSelectedRows={setSelectedRows}
          />
        </DialogContent>
        <DialogActions>
          {/* 生成图片的按钮 */}
          <Button
            onClick={handleGenerateImage}
            variant="contained"
            color="primary"
          >
            Generate Selected Table Image
          </Button>
          <Button onClick={handleSpecPageClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ToolMenu;
