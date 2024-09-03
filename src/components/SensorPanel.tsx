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
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { SensorConfig } from "../types/Common";
import DeleteIcon from "@mui/icons-material/Delete";
import { ArrowForwardIosOutlined, TableRows } from "@mui/icons-material";
import HighlightIcon from "@mui/icons-material/Highlight";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import InfoIcon from "@mui/icons-material/Info";

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
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(true);

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

    if (newOptions && newOptions.includes("info")) {
      setExpandedIndex(index);
      onSelectSensor(index);
    } else if (expandedIndex === index) {
      setExpandedIndex(null);
      onSelectSensor(null);
    }
  };

  const handleDeleteClick = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedConfig = [...sensorConfiguration];
    updatedConfig.splice(index, 1);
    setSensorConfiguration(updatedConfig);
    localStorage.setItem("sensorConfig", JSON.stringify(updatedConfig));

    if (expandedIndex === index) {
      setExpandedIndex(null);
      onSelectSensor(null);
    }
  };

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
            }}
          >
            <Typography variant="h6">Sensor Set</Typography>
          </Box>

          <Divider />

          <Box
            sx={{
              overflowY: "auto",
              padding: "10px",
              flexGrow: 1,
            }}
          >
            {sensorConfiguration.map((sensor, index) => (
              <Paper
                key={index}
                elevation={3}
                sx={{
                  padding: "10px",
                  marginBottom: "10px",
                  position: "relative", // 让子元素的定位相对于Paper
                  backgroundColor:
                    expandedIndex === index ? "#f8f7f7" : "#ffffff",
                  border:
                    expandedIndex === index ? "3px solid #0698b4" : "none",
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
                    exclusive={false} // 允许多选
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
                    <ToggleButton
                      value="info"
                      aria-label="info"
                      sx={{ width: 28, height: 28 }}
                    >
                      <InfoIcon sx={{ fontSize: "16px" }} />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                <Collapse
                  in={expandedIndex === index}
                  timeout="auto"
                  unmountOnExit
                >
                  {/* 额外的内容可以放在这里 */}
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
