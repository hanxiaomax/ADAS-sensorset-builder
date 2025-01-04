import React, { useState } from "react";
import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import FeedbackIcon from "@mui/icons-material/Feedback";
import PanToolIcon from "@mui/icons-material/PanTool";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SensorsIcon from "@mui/icons-material/Sensors";

import Sensor from "../../types/Sensor";

interface BottomMenuProp {
  sensors: Sensor[];
  setSensors: React.Dispatch<React.SetStateAction<Sensor[]>>;
  PanelComponent?: React.ReactNode; // 可选的外部传入 Panel 组件
}
const BottomMenu: React.FC<BottomMenuProp> = ({
  sensors,
  setSensors,
  PanelComponent,
}) => {
  const [zoomLevel, setZoomLevel] = React.useState(95);
  const [panelOpen, setPanelOpen] = useState(false);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 5, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 5, 10));
  };

  const togglePanel = () => {
    setPanelOpen(!panelOpen);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        backgroundColor: "#ffffff",
        zIndex: 1200,
      }}
    >
      <ButtonGroup
        variant="contained"
        sx={{
          gap: "6px",
          "& .MuiButtonBase-root": {
            textTransform: "none",
            color: "#0c7a92",
            borderColor: "#FFF",
            backgroundColor: "#fff",
            "&:hover": {
              backgroundColor: "#0c7a92",
              color: "white",
            },
          },
        }}
      >
        <Button startIcon={<FeedbackIcon />}>Feedback</Button>
        <Button>
          <PanToolIcon />
        </Button>
        {PanelComponent && (
          <Button onClick={togglePanel}>
            <SensorsIcon />
          </Button>
        )}
        <Button onClick={handleZoomOut}>
          <RemoveIcon />
        </Button>
        <Typography
          variant="body2"
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "0 8px",
            fontWeight: "bold",
          }}
        >
          {zoomLevel}%
        </Typography>
        <Button onClick={handleZoomIn}>
          <AddIcon />
        </Button>
      </ButtonGroup>

      {PanelComponent && panelOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "300px",
            height: "400px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            zIndex: 1200,
            overflow: "auto",
          }}
        >
          {PanelComponent}
        </Box>
      )}
    </Box>
  );
};

export default BottomMenu;
