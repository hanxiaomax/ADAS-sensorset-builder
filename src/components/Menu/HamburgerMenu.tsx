import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Box,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Typography,
  Link,
  Button,
  Popover,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  ImportExport,
  Help,
  GitHub,
  Download,
  Email,
} from "@mui/icons-material";
import { useSceneStore } from "../../stores/sceneStore";
import { useSensorStore } from "../../stores/sensorStore";
import notifier from "../Helper/Notification";
import { useSnackbar } from "notistack";
import DownloadPanel from "../Panels/DownloadPanel";
import { Stage } from "konva/lib/Stage";

interface HamburgerMenuProps {
  stageRef: React.RefObject<Stage>;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ stageRef }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [downloadAnchorEl, setDownloadAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const open = Boolean(anchorEl);

  const { viewState, sensors, selectionState } = useSceneStore();
  const { scale, stagePos, rotation } = viewState;
  const { selectedSensorId } = selectionState;
  const selectedSensor = selectedSensorId
    ? sensors.find((s) => s.id === selectedSensorId)
    : null;
  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(() => {
    notifier.init(enqueueSnackbar);
  }, [enqueueSnackbar]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAboutOpen = () => {
    setAboutOpen(true);
    handleMenuClose();
  };

  const handleAboutClose = () => {
    setAboutOpen(false);
  };

  const handleDownloadClick = (event: React.MouseEvent<HTMLElement>) => {
    setDownloadAnchorEl(event.currentTarget);
    handleMenuClose();
  };

  const handleDownloadClose = () => {
    setDownloadAnchorEl(null);
  };

  const handleImportScene = () => {
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
          notifier.success("Scene imported successfully!");
        } catch (error) {
          console.error("Error loading scene:", error);
          notifier.error("Failed to load scene configuration file");
        }
      };
      reader.readAsText(file);
    };

    input.click();
    handleMenuClose();
  };

  const handleExportScene = () => {
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
    notifier.success("Scene exported successfully!");
    handleMenuClose();
  };

  const isDownloadOpen = Boolean(downloadAnchorEl);
  const downloadId = isDownloadOpen ? "download-popover" : undefined;

  return (
    <>
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
          PaperProps={{
            sx: {
              width: 280,
              maxWidth: "100%",
            },
          }}
        >
          <MenuItem onClick={handleDownloadClick}>
            <ListItemIcon>
              <Download fontSize="small" />
            </ListItemIcon>
            <ListItemText>Download</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleImportScene}>
            <ListItemIcon>
              <ImportExport fontSize="small" />
            </ListItemIcon>
            <ListItemText>Import Scene</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleExportScene}>
            <ListItemIcon>
              <ImportExport fontSize="small" />
            </ListItemIcon>
            <ListItemText>Export Scene</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleAboutOpen}>
            <ListItemIcon>
              <Help fontSize="small" />
            </ListItemIcon>
            <ListItemText>About</ListItemText>
          </MenuItem>
        </Menu>
      </Box>

      <Dialog open={aboutOpen} onClose={handleAboutClose}>
        <DialogTitle>About</DialogTitle>
        <DialogContent>
          <Avatar
            src="https://avatars.githubusercontent.com/u/3370445?v=4"
            alt="Author's Avatar"
            sx={{ width: 80, height: 80, mb: 2 }}
          />
          <Typography variant="h4">Yet Another ADAS Scene Builder</Typography>
          <Typography variant="overline">
            A handy tool for ADAS Product Managers,System Engineers,Testers and
            everyone
          </Typography>
          <Box height={50}></Box>

          <Box display="flex" alignItems="center" mb={1}>
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

          <Box display="flex" alignItems="center" mb={1}>
            <Email sx={{ mr: 1 }} />
            <Typography variant="body2">hanxiaomax@qq.com</Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={1}>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAboutClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Popover
        id={downloadId}
        open={isDownloadOpen}
        anchorEl={downloadAnchorEl}
        onClose={handleDownloadClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <DownloadPanel stageRef={stageRef} />
      </Popover>
    </>
  );
};

export default HamburgerMenu;
