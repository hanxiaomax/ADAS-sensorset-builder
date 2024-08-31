import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Collapse,
  IconButton,
  Grid,
  Drawer,
  Divider,
  Button,
} from "@mui/material";
import { SensorConfig } from "../types/Common";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  AppsOutlined,
  ArrowForwardIosOutlined,
  ExpandLessOutlined,
  ExpandMoreOutlined,
  FormatListBulletedTwoTone,
  TableRows,
  TvTwoTone,
} from "@mui/icons-material";

interface SensorPanelProps {
  sensorConfiguration: SensorConfig[];
  setSensorConfiguration: React.Dispatch<React.SetStateAction<SensorConfig[]>>;
  onSelectSensor: (index: number | null) => void; // 修改回调函数，允许取消选择
}

const SensorPanel: React.FC<SensorPanelProps> = ({
  sensorConfiguration,
  setSensorConfiguration,
  onSelectSensor,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(true); // 控制 Drawer 的状态

  const handleExpandClick = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null); // 取消展开
      onSelectSensor(null); // 取消选择，取消高亮
    } else {
      setExpandedIndex(index); // 展开新的传感器
      onSelectSensor(index); // 选择传感器并高亮
    }
  };

  const handleDeleteClick = (index: number, event: React.MouseEvent) => {
    event.stopPropagation(); // 阻止事件冒泡
    const updatedConfig = [...sensorConfiguration];
    updatedConfig.splice(index, 1); // 删除指定的传感器
    setSensorConfiguration(updatedConfig);
    localStorage.setItem("sensorConfig", JSON.stringify(updatedConfig)); // 更新localStorage中的数据

    // 如果删除的是当前选中的传感器，取消高亮显示
    if (expandedIndex === index) {
      setExpandedIndex(null);
      onSelectSensor(null);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <IconButton
        onClick={toggleDrawer}
        sx={{
          position: "fixed",
          color: "#0c7a92",
          top: 0, // 垂直居中
          right: 0, // 放置在右侧
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
            }}
          >
            <Typography variant="h6">Sensor Set</Typography>
          </Box>

          <Divider />

          <Box
            sx={{
              overflowY: "auto",
              padding: "10px",
              flexGrow: 1, // 确保列表部分占满剩余空间
            }}
          >
            {sensorConfiguration.map((sensor, index) => (
              <Paper
                key={index}
                elevation={3}
                sx={{
                  padding: "10px",
                  marginBottom: "10px",
                  backgroundColor:
                    expandedIndex === index ? "#f8f7f7" : "#ffffff",
                  border:
                    expandedIndex === index ? "3px solid #0698b4" : "none",
                  cursor: "pointer",
                }}
                onClick={() => handleExpandClick(index)}
              >
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
                    <Typography variant="subtitle1">
                      {sensor.profile.name}
                    </Typography>
                    <Typography variant="body2">
                      Position: {sensor.mountPosition!.name}
                    </Typography>
                  </Grid>
                </Grid>

                <Collapse
                  in={expandedIndex === index}
                  timeout="auto"
                  unmountOnExit
                >
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs>
                      <Typography variant="body2">
                        More details about {sensor.profile.name}...
                      </Typography>
                    </Grid>
                    <Grid item>
                      <IconButton
                        onClick={(event) => handleDeleteClick(index, event)}
                        size="small"
                        sx={{
                          backgroundColor: "#fefeff",
                          color: "#000",
                          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)", // 自定义阴影
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Collapse>
              </Paper>
            ))}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default SensorPanel;
