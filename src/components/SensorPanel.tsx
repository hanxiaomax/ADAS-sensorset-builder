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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteIcon from "@mui/icons-material/Delete";
import { DeleteOutlineOutlined } from "@mui/icons-material";

interface SensorPanelProps {
  sensorConfiguration: SensorConfig[];
  onDelete: (index: number) => void;
}

const SensorPanel: React.FC<SensorPanelProps> = ({
  sensorConfiguration,
  onDelete,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleExpandClick = (index: number) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
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
                  src={sensor.img || undefined}
                  alt={sensor.name}
                  sx={{
                    width: 30,
                    height: 30,
                    backgroundColor: "#e0e0e0",
                  }}
                >
                  {!sensor.img && sensor.name![0]}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="subtitle1">{sensor.name}</Typography>
                <Typography variant="body2">
                  Position: {(sensor.mountPosition as MountPosition).name}
                </Typography>
              </Grid>
            </Grid>

            {/* 展开部分 */}
            <Collapse in={expandedIndex === index} timeout="auto" unmountOnExit>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs>
                  <Typography variant="body2">
                    More details about {sensor.name}...
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
                    <DeleteOutlineOutlined />
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
