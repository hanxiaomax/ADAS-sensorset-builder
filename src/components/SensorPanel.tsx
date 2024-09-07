import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Grid,
  Drawer,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Menu,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import { SensorConfig } from "../types/Common";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  ArrowForwardIosOutlined,
  TableRows,
  FilterList,
} from "@mui/icons-material";
import HighlightIcon from "@mui/icons-material/Highlight";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface SensorPanelProps {
  sensorConfiguration: SensorConfig[];
  setSensorConfiguration: React.Dispatch<React.SetStateAction<SensorConfig[]>>;
  onSelectSensor: (index: number | null) => void;
}

const SensorPanel: React.FC<SensorPanelProps> = ({
  sensorConfiguration,
  setSensorConfiguration,
  onSelectSensor,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // 用于控制筛选菜单的显示
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]); // 记录当前筛选的类型

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleToggleChange = (
    index: number,
    event: React.MouseEvent<HTMLElement>,
    newOptions: string[] | null
  ) => {
    const updatedConfig = [...sensorConfiguration];
    updatedConfig[index] = {
      ...updatedConfig[index],
      selectedOptions: newOptions || [], // 更新选中的状态
    };
    setSensorConfiguration(updatedConfig);
  };

  const handleDeleteClick = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedConfig = [...sensorConfiguration];
    updatedConfig.splice(index, 1);
    setSensorConfiguration(updatedConfig);
    localStorage.setItem("sensorConfig", JSON.stringify(updatedConfig));
  };

  // 打开筛选菜单
  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // 关闭筛选菜单
  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  // 处理多选
  const handleTypeChange = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type)); // 取消选中
    } else {
      setSelectedTypes([...selectedTypes, type]); // 添加选中
    }
  };

  // 筛选传感器
  const filteredSensors = selectedTypes.length
    ? sensorConfiguration.filter((sensor) =>
        selectedTypes.includes(sensor.profile.type)
      )
    : sensorConfiguration; // 如果未选中任何类型，显示所有传感器

  return (
    <>
      <IconButton
        onClick={toggleDrawer}
        sx={{
          position: "fixed",
          color: "#0c7a92",
          top: 0,
          right: 0,
          fontSize: "40px",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1300,
        }}
      >
        {drawerOpen ? (
          <ArrowForwardIosOutlined sx={{ fontSize: "40px", color: "white" }} />
        ) : (
          <TableRows sx={{ fontSize: "40px" }} />
        )}
      </IconButton>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{ zIndex: 1200 }}
        variant="persistent"
      >
        <Box
          sx={{
            width: "20vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              padding: "10px",
              backgroundColor: "#0c7a92",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Sensor Set</Typography>

            {/* 筛选按钮 */}
          </Box>

          <Menu
            id="filter-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleFilterClose}
          >
            <MenuItem>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedTypes.includes("uss")}
                    onChange={() => handleTypeChange("uss")}
                  />
                }
                label="USS"
              />
            </MenuItem>
            <MenuItem>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedTypes.includes("lidar")}
                    onChange={() => handleTypeChange("lidar")}
                  />
                }
                label="Lidar"
              />
            </MenuItem>
            <MenuItem>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedTypes.includes("camera")}
                    onChange={() => handleTypeChange("camera")}
                  />
                }
                label="Camera"
              />
            </MenuItem>
            <MenuItem>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedTypes.includes("radar")}
                    onChange={() => handleTypeChange("radar")}
                  />
                }
                label="Radar"
              />
            </MenuItem>
          </Menu>

          <Divider />

          <Box
            sx={{
              overflowY: "auto",
              paddingRight: "10px",
              paddingLeft: "10px",
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end", // 将内容靠右对齐
                alignItems: "center", // 垂直居中对齐
              }}
            >
              <IconButton
                aria-controls="filter-menu"
                aria-haspopup="true"
                onClick={handleFilterClick}
              >
                <FilterList />
              </IconButton>
            </Box>

            <Divider />
            {filteredSensors.map((sensor, index) => (
              <Paper
                key={index}
                elevation={3}
                sx={{
                  padding: "10px",
                  marginBottom: "10px",
                  position: "relative",
                  backgroundColor: "#ffffff",
                  cursor: "pointer",
                }}
              >
                <IconButton
                  onClick={(event) => handleDeleteClick(index, event)}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    backgroundColor: "#097c74",
                    color: "white",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                    width: 24,
                    height: 24,
                    "&:hover": {
                      backgroundColor: "#ff1744",
                      color: "white",
                    },
                  }}
                >
                  <DeleteIcon sx={{ fontSize: "16px" }} />
                </IconButton>

                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Avatar
                      src={sensor.profile.image || undefined}
                      alt={sensor.profile.name}
                      sx={{
                        width: 30,
                        height: 30,
                        backgroundColor: "#e0e0e0",
                      }}
                    >
                      {!sensor.profile.image && sensor.profile.name![0]}
                    </Avatar>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="subtitle1" sx={{ fontSize: "14px" }}>
                      {sensor.profile.name}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: "12px" }}>
                      Position: {sensor.mountPosition!.name}
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ display: "flex", justifyContent: "right", mt: 1 }}>
                  <ToggleButtonGroup
                    value={sensor.selectedOptions || []}
                    onChange={(event, newOptions) =>
                      handleToggleChange(index, event, newOptions)
                    }
                    aria-label="sensor options"
                    size="small"
                    exclusive={false}
                  >
                    <ToggleButton
                      value="highlight"
                      aria-label="highlight"
                      sx={{ width: 28, height: 28 }}
                    >
                      <HighlightIcon sx={{ fontSize: "16px" }} />
                    </ToggleButton>
                    <ToggleButton
                      value="hide"
                      aria-label="hide"
                      sx={{ width: 28, height: 28 }}
                    >
                      <VisibilityOffIcon sx={{ fontSize: "16px" }} />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default SensorPanel;
