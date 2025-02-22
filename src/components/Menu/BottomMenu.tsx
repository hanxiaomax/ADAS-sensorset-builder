import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Typography,
  IconButton,
  Avatar,
  Link,
} from "@mui/material";
import FeedbackIcon from "@mui/icons-material/Feedback";
import SensorsIcon from "@mui/icons-material/Sensors";
import CloseIcon from "@mui/icons-material/Close";
import SensorPanelEx from "../Panels/SensorPanelex";
import { GitHub, Email } from "@mui/icons-material";

interface BottomMenuProp {}

const BottomMenu: React.FC<BottomMenuProp> = () => {
  const [openPanel, setOpenPanel] = useState<string | null>(null);

  const panels = [
    {
      name: "Feedback",
      icon: <FeedbackIcon />,
      description: "Provide feedback to improve the application.",
      panel: (
        <Box sx={{ padding: 2 }}>
          <Box sx={{ mb: 4 }}>
            <Avatar
              src="https://avatars.githubusercontent.com/u/3370445?v=4"
              alt="Author's Avatar"
              sx={{ width: 80, height: 80, mb: 2 }}
            />
            <Typography variant="h4" sx={{ mb: 1 }}>
              Yet Another ADAS Scene Builder
            </Typography>
            <Typography variant="overline" sx={{ display: "block", mb: 3 }}>
              A handy tool for ADAS Product Managers, System Engineers, Testers
              and everyone
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box display="flex" alignItems="center">
              <GitHub sx={{ mr: 1 }} />
              <Typography variant="body2">
                <Link
                  href="https://github.com/hanxiaomax"
                  target="_blank"
                  rel="noopener"
                >
                  Lingfeng AI
                </Link>
              </Typography>
            </Box>

            <Box display="flex" alignItems="center">
              <Email sx={{ mr: 1 }} />
              <Typography variant="body2">hanxiaomax@qq.com</Typography>
            </Box>

            <Box display="flex" alignItems="center">
              <GitHub sx={{ mr: 1 }} />
              <Typography variant="body2">
                <Link
                  href="https://github.com/hanxiaomax/ADAS-sensorset-builder"
                  target="_blank"
                  rel="noopener"
                >
                  GitHub Project
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      ),
    },
    {
      name: "Installed Sensors",
      icon: <SensorsIcon />,
      description: "Manage sensors Installed Sensors",
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
