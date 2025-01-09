import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import FeedbackIcon from "@mui/icons-material/Feedback";
import CloseIcon from "@mui/icons-material/Close";
import DehazeOutlinedIcon from "@mui/icons-material/DehazeOutlined";
import SaveIcon from "@mui/icons-material/Save";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import DeleteIcon from "@mui/icons-material/Delete";
import HelpIcon from "@mui/icons-material/Help";
import InfoIcon from "@mui/icons-material/Info";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import useSceneStore from "../../stores/sceneStore";
import { ContentCopy, ContentCut, ContentPaste } from "@mui/icons-material";

interface BottomMenuProp {}

const BottomMenu: React.FC<BottomMenuProp> = () => {
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [background, setBackground] = useState("#ffffff");
  const { saveSceneToFile, loadSceneFromFile, clearScene } = useSceneStore();

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

  const handleClearCanvas = () => {
    if (window.confirm("Clear the entire canvas? This cannot be undone.")) {
      clearScene();
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
            backgroundColor: "#FFF",
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
        sx={{ mt: -1 }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            handleSaveSceneToFile();
          }}
        >
          <ListItemIcon>
            <SaveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Save Scene</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            handleLoadSceneFromFile();
          }}
        >
          <ListItemIcon>
            <FolderOpenIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Load Scene</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            handleClearCanvas();
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Clean Canvas</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            setHelpOpen(true);
          }}
        >
          <ListItemIcon>
            <HelpIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Help</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            setAboutOpen(true);
          }}
        >
          <ListItemIcon>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>About</ListItemText>
        </MenuItem>
      </Menu>

      {/* Help Dialog */}
      <Dialog open={helpOpen} onClose={() => setHelpOpen(false)}>
        <DialogTitle>Help</DialogTitle>
        <DialogContent>
          <Typography>
            This is the help content. Add your help information here.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* About Dialog */}
      <Dialog open={aboutOpen} onClose={() => setAboutOpen(false)}>
        <DialogTitle>About</DialogTitle>
        <DialogContent>
          <Typography>
            This is the about content. Add your project information here.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAboutOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

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
