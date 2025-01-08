import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import FeedbackIcon from "@mui/icons-material/Feedback";
import CloseIcon from "@mui/icons-material/Close";
import DehazeOutlinedIcon from "@mui/icons-material/DehazeOutlined";
import SaveIcon from "@mui/icons-material/Save";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import useSceneStore from "../../stores/sceneStore";

interface BottomMenuProp {}

const BottomMenu: React.FC<BottomMenuProp> = () => {
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [sceneMenuAnchor, setSceneMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const { saveSceneToFile, loadSceneFromFile } = useSceneStore();

  const handleSaveSceneToFile = () => {
    if (window.confirm("Save current scene to file?")) {
      saveSceneToFile();
    }
  };

  const handleLoadSceneFromFile = async () => {
    if (window.confirm("This will overwrite the current scene. Continue?")) {
      await loadSceneFromFile();
    }
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const panels = [
    {
      name: "More",
      icon: <DehazeOutlinedIcon />,
      onClick: handleMenuClick,
    },
    {
      name: "Feedback",
      icon: <FeedbackIcon />,
      description: "Provide feedback to improve the application.",
      panel: <Box sx={{ padding: 2 }}>Feedback Panel Content</Box>,
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
            onClick={
              panel.onClick ||
              (() => panel.name && handlePanelClick(panel.name))
            }
            startIcon={panel.icon}
          >
            {panel.name}
          </Button>
        ))}
      </ButtonGroup>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={() => {
            handleSaveSceneToFile();
            handleMenuClose();
          }}
        >
          <SaveIcon sx={{ mr: 1 }} />
          Save Scene
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleLoadSceneFromFile();
            handleMenuClose();
          }}
        >
          <FolderOpenIcon sx={{ mr: 1 }} />
          Load Scene
        </MenuItem>
      </Menu>

      {panels
        .filter((panel) => panel.name !== "More")
        .map((panel) => (
          <PanelWrapper
            key={panel.name}
            name={panel.name!}
            description={panel.description!}
          >
            {panel.panel}
          </PanelWrapper>
        ))}
    </Box>
  );
};

export default BottomMenu;
