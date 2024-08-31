import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Collapse,
  IconButton,
  Grid,
} from "@mui/material";
import { SensorConfig, MountPosition } from "../types/Common";
import DeleteIcon from "@mui/icons-material/Delete";

interface SensorPanelProps {
  sensorConfiguration: SensorConfig[];
  onDelete: (index: number) => void;
  onSelectSensor: (index: number) => void; // 新增的回调函数，用于选择传感器
}

const SensorPanel: React.FC<SensorPanelProps> = ({
  sensorConfiguration,
  onDelete,
  onSelectSensor,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  console.log("11", sensorConfiguration);
  const handleExpandClick = (index: number) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
    onSelectSensor(index); // 当展开时，选择传感器
  };

  const handleDeleteClick = (index: number, event: React.MouseEvent) => {
    event.stopPropagation(); // 阻止事件冒泡
    onDelete(index);
  };

  return (
    <Box
      borderRadius={2}
      boxShadow={3}
      bgcolor="#efefef"
      position="absolute"
      top={40}
      right={16}
      sx={{
        width: "20vw",
        height: "80vh",
        backgroundColor: "#f0f0f0",
        zIndex: 1200,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header部分，始终保持可见 */}
      <Box
        sx={{
          padding: "10px",
          backgroundColor: "#f0f0f0",
          position: "sticky",
          top: 0,
          zIndex: 1200,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Sensor Configuration
        </Typography>
      </Box>

      {/* 可滚动的传感器列表部分 */}
      <Box
        sx={{
          overflowY: "auto",
          padding: "10px",
        }}
      >
        {sensorConfiguration.map((sensor, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{
              padding: "10px",
              marginBottom: "10px",
              backgroundColor: expandedIndex === index ? "#f8f7f7" : "#ffffff",
              border: expandedIndex === index ? "2px solid #3f51b5" : "none",
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
                  {/* Position: {(sensor.mountPosition as MountPosition).name} */}
                </Typography>
              </Grid>
            </Grid>

            {/* 展开部分 */}
            <Collapse in={expandedIndex === index} timeout="auto" unmountOnExit>
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
  );
};

export default SensorPanel;
