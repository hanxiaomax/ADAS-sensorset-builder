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
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import ProfileMenu from "../components/ProfileMenu";
import ViewMenu from "../components/ViewMenu";
import { Stage } from "konva/lib/Stage";
import Konva from "konva"; // 引入 Konva

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
  const [snapshotOpen, setSnapshotOpen] = useState(false); // 控制 Snapshot 对话框
  const [format, setFormat] = useState("png"); // 默认导出格式为 PNG
  const [includeBackground, setIncludeBackground] = useState(false); // 是否包含背景

  const handleAboutOpen = () => {
    setOpen(true);
  };

  const handleAboutClose = () => {
    setOpen(false);
  };

  const handleSnapshotOpen = () => {
    setSnapshotOpen(true); // 打开 Snapshot 对话框
  };

  const handleSnapshotClose = () => {
    setSnapshotOpen(false); // 关闭 Snapshot 对话框
  };

  const handleFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormat((event.target as HTMLInputElement).value);
  };

  const handleSnapshotConfirm = () => {
    if (stageRef && stageRef.current) {
      const stage = stageRef.current;
      let backgroundLayer: Konva.Layer | null = null;

      // 如果用户选择包含背景，我们手动添加一个背景矩形
      if (includeBackground) {
        backgroundLayer = new Konva.Layer();
        const backgroundRect = new Konva.Rect({
          x: 0,
          y: 0,
          width: stage.width(),
          height: stage.height(),
          fill: "#ffffff", // 背景颜色
        });
        backgroundLayer.add(backgroundRect);

        // 将背景层添加到最底层
        stage.add(backgroundLayer);
        backgroundLayer.moveToBottom(); // 移动背景层到最底层
        stage.draw(); // 确保背景立即渲染
      }

      // 导出 PNG
      if (format === "png") {
        const uri = stage.toDataURL({ pixelRatio: 2, mimeType: "image/png" });
        const link = document.createElement("a");
        link.download = "snapshot.png"; // 设置下载文件名
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // 导出完成后移除背景层
      if (backgroundLayer) {
        backgroundLayer.remove();
        stage.draw(); // 重新绘制舞台
      }

      handleSnapshotClose(); // 导出完成后关闭对话框
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
          <Button onClick={handleSnapshotOpen}>Snapshot</Button>{" "}
          {/* 修改为打开 Snapshot 对话框 */}
          <Button onClick={handleAboutOpen}>About</Button>
        </ButtonGroup>
      </AppBar>

      {/* Snapshot Dialog */}
      <Dialog open={snapshotOpen} onClose={handleSnapshotClose}>
        <DialogTitle>Export Snapshot</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            Choose file format:
          </Typography>
          <RadioGroup
            aria-label="format"
            name="format"
            value={format}
            onChange={handleFormatChange}
          >
            <FormControlLabel value="png" control={<Radio />} label="PNG" />
          </RadioGroup>

          <FormControlLabel
            control={
              <Checkbox
                checked={includeBackground}
                onChange={() => setIncludeBackground(!includeBackground)}
              />
            }
            label="Include Background"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSnapshotClose}>Cancel</Button>
          <Button
            onClick={handleSnapshotConfirm}
            variant="contained"
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

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
