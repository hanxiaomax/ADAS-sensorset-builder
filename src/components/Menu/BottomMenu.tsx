import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Typography,
  IconButton,
} from "@mui/material";
import FeedbackIcon from "@mui/icons-material/Feedback";

import SensorsIcon from "@mui/icons-material/Sensors";
import CloseIcon from "@mui/icons-material/Close";
import SensorPanelEx from "../Panels/SensorPanelex";

interface BottomMenuProp {}

const BottomMenu: React.FC<BottomMenuProp> = () => {
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(95);

  const panels = [
    {
      name: "Feedback",
      icon: <FeedbackIcon />,
      description: "Provide feedback to improve the application.",
      panel: <Box sx={{ padding: 2 }}>Feedback Panel Content</Box>,
    },
    {
      name: "Sensors",
      icon: <SensorsIcon />,
      description: "Manage sensors and configurations.",
      panel: <SensorPanelEx />,
    },
  ];

  const handlePanelClick = (panelName: string) => {
    setOpenPanel(openPanel === panelName ? null : panelName);
  };

  const PanelWrapper: React.FC<{
    name: string;
    description: string;
    children?: React.ReactNode;
  }> = ({ name, description, children }) => {
    const isVisible = openPanel === name;

    return (
      <Box
        sx={{
          position: "fixed",
          bottom: "80px",
          right: "20px",
          backgroundColor: "#FFFFFF",
          boxShadow: 3,
          borderRadius: "8px",
          zIndex: 1200,
          display: isVisible ? "block" : "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 2,
            borderBottom: "1px solid #ddd",
          }}
        >
          <Box>
            <Typography variant="h6">{name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {description}
            </Typography>
          </Box>
          <IconButton
            onClick={() => setOpenPanel(null)}
            sx={{ alignSelf: "flex-start" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box>{children}</Box>
      </Box>
    );
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
        {panels.map((panel) => (
          <Button
            key={panel.name}
            onClick={() => handlePanelClick(panel.name)}
            startIcon={panel.icon}
          >
            {panel.name}
          </Button>
        ))}
      </ButtonGroup>

      {panels.map((panel) => (
        <PanelWrapper
          key={panel.name}
          name={panel.name}
          description={panel.description}
        >
          {panel.panel}
        </PanelWrapper>
      ))}
    </Box>
  );
};

export default BottomMenu;
