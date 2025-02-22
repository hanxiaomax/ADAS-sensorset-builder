import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Box,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Settings, ImportExport, Help, GitHub } from "@mui/icons-material";
import { useSceneStore } from "../../stores/sceneStore";

const HamburgerMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { scale, stagePos, rotation, sensors, selectedSensor } =
    useSceneStore();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const sceneData = JSON.parse(event.target?.result as string);
          useSceneStore.setState(sceneData);
        } catch (error) {
          console.error("Error loading scene:", error);
          alert("Failed to load scene configuration file");
        }
      };
      reader.readAsText(file);
    };

    input.click();
    handleMenuClose();
  };

  const handleExport = () => {
    const sceneData = {
      scale,
      stagePos,
      rotation,
      sensors,
      selectedSensor,
    };

    const blob = new Blob([JSON.stringify(sceneData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "scene_config.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    handleMenuClose();
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 1100,
      }}
    >
      <IconButton
        onClick={handleMenuClick}
        size="large"
        sx={{
          backgroundColor: "white",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          },
          boxShadow: 2,
        }}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleImport}>
          <ListItemIcon>
            <ImportExport fontSize="small" />
          </ListItemIcon>
          <ListItemText>Import Scene</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleExport}>
          <ListItemIcon>
            <ImportExport fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export Scene</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Help fontSize="small" />
          </ListItemIcon>
          <ListItemText>Help</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <GitHub fontSize="small" />
          </ListItemIcon>
          <ListItemText>GitHub</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default HamburgerMenu;
