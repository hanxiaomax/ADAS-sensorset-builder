import React, { useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  Typography,
  IconButton,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import SensorsIcon from "@mui/icons-material/Sensors";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import CategoryIcon from "@mui/icons-material/Category";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import WidgetsIcon from "@mui/icons-material/Widgets";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ImageIcon from "@mui/icons-material/Image";

const SidebarMenu: React.FC = () => {
  const [openPanel, setOpenPanel] = useState<string | null>(null);

  const panels = [
    {
      name: "Backdrop",
      icon: <WallpaperIcon />,
      description: "Configure the background of your canvas.",
    },
    {
      name: "Shape",
      icon: <CategoryIcon />,
      description: "Add and customize shapes in your project.",
    },
    {
      name: "Vehicle",
      icon: <DirectionsCarIcon />,
      description: "Insert and configure vehicles for simulations.",
    },
    {
      name: "Sensor",
      icon: <SensorsIcon />,
      description: "Manage and configure sensors in your scene.",
    },
    {
      name: "Object",
      icon: <WidgetsIcon />,
      description: "Add interactive objects to your scene.",
    },
    {
      name: "Text",
      icon: <TextFieldsIcon />,
      description: "Add and format text elements.",
    },
    {
      name: "Image",
      icon: <ImageIcon />,
      description: "Insert and manage images in your project.",
    },
  ];

  const handlePanelClick = (panelName: string) => {
    setOpenPanel(openPanel === panelName ? null : panelName);
  };

  const SidePanel: React.FC<{
    name: string;
    description: string;
    children?: React.ReactNode;
  }> = ({ name, description, children }) => {
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
          borderRadius: "8px 8px 8px 8px",
          boxShadow: 3,
        }}
      >
        <List sx={{ padding: 0 }}>
          {panels.map((panel) => (
            <SidePanel
              key={panel.name}
              name={panel.name}
              description={panel.description}
            >
              Content for {panel.name}
            </SidePanel>
          ))}

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
        <SidePanel
          key={panel.name}
          name={panel.name}
          description={panel.description}
        >
          Content for {panel.name}
        </SidePanel>
      ))}
    </Box>
  );
};

export default SidebarMenu;
