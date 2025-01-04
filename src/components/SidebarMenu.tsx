import React, { useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const SidebarMenu: React.FC = () => {
  const [openPanel, setOpenPanel] = useState<string | null>(null);

  const panels = [
    { name: "Backdrop", icon: <AddCircleOutlineIcon /> },
    { name: "Frames", icon: <AddCircleOutlineIcon /> },
    { name: "Shape", icon: <AddCircleOutlineIcon /> },
    { name: "Character", icon: <AddCircleOutlineIcon /> },
    { name: "Props", icon: <AddCircleOutlineIcon /> },
    { name: "Speech", icon: <AddCircleOutlineIcon /> },
    { name: "Text", icon: <AddCircleOutlineIcon /> },
    { name: "Image", icon: <AddCircleOutlineIcon /> },
  ];

  const handlePanelClick = (panelName: string) => {
    setOpenPanel(openPanel === panelName ? null : panelName);
  };

  const SidePanel: React.FC<{ name: string; children?: React.ReactNode }> = ({
    name,
    children,
  }) => {
    const isVisible = openPanel === name;

    return (
      <Box
        sx={{
          position: "fixed",
          top: "10vh",
          left: 110,
          height: "60vh",
          width: 300,
          backgroundColor: "#FFFFFF",
          boxShadow: 3,
          borderRadius: "8px 8px 8px 8px",
          zIndex: 1200,
          display: isVisible ? "block" : "none",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" sx={{ padding: 2 }}>
          {name}
        </Typography>
        <Box sx={{ padding: 2 }}>
          {children || `No content available for ${name}`}
        </Box>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        position: "relative",
        zIndex: 1300,
        display: "flex",
        height: "80vh",
      }}
    >
      <Box
        sx={{
          position: "fixed",
          left: 20,
          top: "10vh",
          bottom: "10vh",
          height: "60vh",
          width: 80,
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #ddd",
          borderRadius: "0 8px 8px 0",
          boxShadow: "2px 0px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        <List sx={{ padding: 0 }}>
          {panels.map((panel) => (
            <ListItemButton
              key={panel.name}
              onClick={() => handlePanelClick(panel.name)}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 0",
                "&:hover": {
                  backgroundColor: "#eaeaea",
                  cursor: "pointer",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  justifyContent: "center",
                  color: "#666",
                  minWidth: 0,
                  marginBottom: "4px",
                }}
              >
                {panel.icon}
              </ListItemIcon>
              <Typography
                variant="caption"
                sx={{ fontSize: "0.75rem", color: "#333", textAlign: "center" }}
              >
                {panel.name}
              </Typography>
            </ListItemButton>
          ))}
        </List>
      </Box>

      {panels.map((panel) => (
        <SidePanel key={panel.name} name={panel.name}>
          Content for {panel.name}
        </SidePanel>
      ))}
    </Box>
  );
};

export default SidebarMenu;
