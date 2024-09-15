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
import EnhancedTable from "./EnhancedTable"; // 引入表格组件

const ToolMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [specPageOpen, setSpecPageOpen] = useState<boolean>(false);

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
        <MenuItem onClick={handleSpecPageOpen}>Create BOM Table</MenuItem>
      </Menu>

      {/* Spec 对话框 */}
      <Dialog
        open={specPageOpen}
        onClose={handleSpecPageClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Sensor BOM</DialogTitle>
        <DialogContent>
          {/* 在对话框内显示表格 */}
          <EnhancedTable />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSpecPageClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ToolMenu;
