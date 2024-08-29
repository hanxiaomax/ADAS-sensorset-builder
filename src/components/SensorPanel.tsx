import React from "react";
import { Box, Typography, Paper, Avatar } from "@mui/material";
import { SensorConfig, MountPosition } from "../types/Common";

interface SensorPanelProps {
  sensorConfiguration: SensorConfig[];
}

const SensorPanel: React.FC<SensorPanelProps> = ({ sensorConfiguration }) => {
  return (
    <Box
      borderRadius={4}
      boxShadow={3}
      bgcolor="#efefef"
      position="absolute"
      top={40}
      right={16}
      sx={{
        width: "20vw",
        height: "85vh",
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
              display: "flex",
              alignItems: "center",
              padding: "10px",
              marginBottom: "10px",
              backgroundColor: "#ffffff",
            }}
          >
            <Avatar
              src={sensor.img || undefined}
              alt={sensor.name}
              sx={{
                width: 50,
                height: 50,
                marginRight: "10px",
                backgroundColor: "#e0e0e0",
              }}
            >
              {!sensor.img && sensor.name![0]}
            </Avatar>

            <Box>
              <Typography variant="subtitle1">{sensor.name}</Typography>
              <Typography variant="body2">
                Position: {(sensor.mountPosition as MountPosition).name}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default SensorPanel;
