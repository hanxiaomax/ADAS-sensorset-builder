import React, { useState } from "react";
import {
  AppBar,
  Button,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Typography,
  Link,
  Box,
  Popover,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import ProfileMenu from "./ProfileMenu";
import DownloadPanel from "../Panels/DownloadPanel";
import { Stage } from "konva/lib/Stage";
import DownloadIcon from "@mui/icons-material/Download";
import { useSensorStore } from "../../stores/sensorStore";
import { SensorStocks } from "../../types/Common";
import { Sensor } from "../../types/Sensor";

interface MenuBarProps {
  stageRef: React.RefObject<Stage>;
}

const MenuBar: React.FC<MenuBarProps> = ({ stageRef }) => {
  const {
    sensorConfiguration,
    setSensorConfiguration,
    sensorStocks,
    setSensorStocks,
  } = useSensorStore();

  const [open, setOpen] = useState(false);
  const [downloadAnchorEl, setDownloadAnchorEl] =
    useState<HTMLButtonElement | null>(null);

  const handleSensorStockImport = (data: SensorStocks) => {
    setSensorStocks(data);
  };

  const handleExport = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(sensorConfiguration, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "sensor_config.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    const stockDataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(sensorStocks, null, 2));
    const stockDownloadNode = document.createElement("a");
    stockDownloadNode.setAttribute("href", stockDataStr);
    stockDownloadNode.setAttribute("download", "sensor_data.json");
    document.body.appendChild(stockDownloadNode);
    stockDownloadNode.click();
    stockDownloadNode.remove();
  };

  const handleAboutOpen = () => {
    setOpen(true);
  };

  const handleAboutClose = () => {
    setOpen(false);
  };

  const handleDownloadClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDownloadAnchorEl(event.currentTarget);
  };

  const handleDownloadClose = () => {
    setDownloadAnchorEl(null);
  };

  const isDownloadOpen = Boolean(downloadAnchorEl);
  const downloadId = isDownloadOpen ? "download-popover" : undefined;

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "#ffffff",
          height: "20px",
        }}
      >
        <ButtonGroup
          disableElevation
          variant="text"
          size="large"
          sx={{
            "& .MuiButtonBase-root": {
              top: "3px",
              borderColor: "#f6f6f6",
              color: "#0c7a92",
              borderRadius: 0,
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#0c7a92",
                color: "white",
              },
            },
          }}
        >
          <ProfileMenu
            onImportSensorStock={handleSensorStockImport}
            onExport={handleExport}
          />
          <Button onClick={handleAboutOpen}>About</Button>
          <Button
            aria-describedby={downloadId}
            onClick={handleDownloadClick}
            sx={{
              position: "absolute",
              right: "10px",
            }}
          >
            <DownloadIcon />
            Download
          </Button>
        </ButtonGroup>
      </AppBar>

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

      <Dialog open={open} onClose={handleAboutClose}>
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
            <GitHubIcon sx={{ mr: 1 }} />
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
            <EmailIcon sx={{ mr: 1 }} />
            <Typography variant="body2">hanxiaomax@qq.com</Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={1}>
            <GitHubIcon sx={{ mr: 1 }} />
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
    </>
  );
};

export default MenuBar;
