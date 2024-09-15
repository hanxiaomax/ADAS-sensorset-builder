import React, { useState, useEffect } from "react";
import {
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { Sensor } from "../../types/Common";

interface ToolMenuProps {}

const ToolMenu: React.FC<ToolMenuProps> = ({}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [specPageOpen, setSpecPageOpen] = useState<boolean>(false);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 5,
    page: 0,
  });

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
    const sensors = JSON.parse(localStorage.getItem("sensorConfig") || "[]");
    if (sensors) {
      setSensors(sensors);
    }
    setSpecPageOpen(true);
  };

  // 关闭spec对话框
  const handleSpecPageClose = () => {
    setSpecPageOpen(false);
  };

  // 定义 DataGrid 列
  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "type", headerName: "Type", flex: 1 },
    { field: "range", headerName: "Range (m)", flex: 1, type: "number" },
    { field: "fov", headerName: "Fov (°)", flex: 1, type: "number" },
  ];

  // 将 sensors 数据转换为 rows
  const rows = sensors.map((sensor, index) => ({
    id: index, // DataGrid 必须有 id 字段
    name: sensor.sensorInfo.name,
    type: sensor.sensorInfo.type,
    range: sensor.sensorInfo.spec.range,
    fov: sensor.sensorInfo.spec.fov,
  }));

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
        <MenuItem onClick={handleSpecPageOpen}>Show Specs</MenuItem>
      </Menu>

      {/* Spec 对话框 */}
      <Dialog
        open={specPageOpen}
        onClose={handleSpecPageClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Sensor Specifications</DialogTitle>
        <DialogContent>
          {sensors.length > 0 ? (
            <Paper sx={{ height: 400, width: "98%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pagination
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                sx={{ border: 1 }}
              />
            </Paper>
          ) : (
            <Typography variant="subtitle1">
              No sensor config found in localStorage.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSpecPageClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ToolMenu;
