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
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import ProfileMenu from "../components/ProfileMenu";
import ViewMenu from "../components/ViewMenu";
import { Stage } from "konva/lib/Stage";

interface MenuBarProps {
  handleSensorSetConfigImport: (data: any) => void;
  handleSensorStockImport: (data: any) => void;
  handleExport: () => void;
  uiConfig: any;
  setUiConfig: (config: any) => void;
  stageRef: React.RefObject<Stage>; // 新增用于传递 stage 的引用
}

const MenuBar: React.FC<MenuBarProps> = ({
  handleSensorSetConfigImport,
  handleSensorStockImport,
  handleExport,
  uiConfig,
  setUiConfig,
  stageRef, // 新增
}) => {
  const [open, setOpen] = useState(false);

  const handleAboutOpen = () => {
    setOpen(true);
  };

  const handleAboutClose = () => {
    setOpen(false);
  };

  const handleSnapshot = () => {
    if (stageRef && stageRef.current) {
      const uri = stageRef.current.toDataURL(); // 获取 Stage 的图像
      const link = document.createElement("a");
      link.download = "snapshot.png"; // 设置下载文件名
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "#ffffff",
          height: "10px",
        }}
      >
        <ButtonGroup
          disableElevation
          variant="text"
          size="large"
          sx={{
            "& .MuiButtonBase-root": {
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
            onImportSensorSetConfigImport={handleSensorSetConfigImport}
            onImportSensorStock={handleSensorStockImport}
            onExport={handleExport}
          />
          <ViewMenu uiConfig={uiConfig} setUiConfig={setUiConfig} />
          <Button>Tools</Button>
          <Button onClick={handleSnapshot}>Snapshot</Button>
          <Button onClick={handleAboutOpen}>About</Button>
        </ButtonGroup>
      </AppBar>

      {/* Dialog for About information */}
      <Dialog open={open} onClose={handleAboutClose}>
        <DialogTitle>About</DialogTitle>
        <DialogContent>
          <Avatar
            src="https://avatars.githubusercontent.com/u/3370445?v=4"
            alt="Author's Avatar"
            sx={{ width: 80, height: 80, mb: 2 }}
          />
          <Typography variant="h3">ADAS Sensor Set Builder</Typography>
          <Typography variant="overline">
            A handy tool for ADAS Product Managers and System Engineers
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
                href="https://github.com/hanxiaomax/vehicle-sensorset-builder"
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
