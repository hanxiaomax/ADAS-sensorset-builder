import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Stage } from "konva/lib/Stage";
import Konva from "konva"; // 引入 Konva
import { useSnackbar } from "notistack";
import notifier from "../Helper/Notification";

interface DownloadPanelProps {
  stageRef: React.RefObject<Stage>; // 新增用于传递 stage 的引用
}

const DownloadPanel: React.FC<DownloadPanelProps> = ({ stageRef }) => {
  const [fileType, setFileType] = useState("JPG");
  const [size, setSize] = useState("1x");
  const [pages, setPages] = useState("Current page only");
  const [includebackground, setIncludeBackground] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  React.useEffect(() => {
    notifier.init(enqueueSnackbar);
  }, [enqueueSnackbar]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeBackground(event.target.checked);
  };

  const handleDownloadClick = () => {
    if (stageRef && stageRef.current) {
      const stage = stageRef.current;
      let backgroundLayer: Konva.Layer | null = null;
      // 如果用户选择包含背景，我们手动添加一个背景矩形
      if (includebackground) {
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
      if (fileType === "PNG") {
        const uri = stage.toDataURL({ pixelRatio: 2, mimeType: "image/png" });
        const link = document.createElement("a");
        link.download = "snapshot.png"; // 设置下载文件名
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        if (includebackground) {
          notifier.success("Image downloaded with background");
        } else {
          notifier.success("Image downloaded with background");
        }
      } else {
        notifier.error("File type " + fileType + " not supported yet");
      }

      // 导出完成后移除背景层
      if (backgroundLayer) {
        backgroundLayer.remove();
        stage.draw(); // 重新绘制舞台
      }
    }
  };

  return (
    <Box
      sx={{
        padding: 2,
        height: "100%",
        width: "50vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#fff",
      }}
    >
      <Box>
        <Typography variant="h6" gutterBottom>
          Download
        </Typography>
        <Box sx={{ marginBottom: 2 }}>
          <FormControl fullWidth>
            <InputLabel shrink>File type</InputLabel>
            <Select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              label="File type"
            >
              <MenuItem value="JPG">JPG</MenuItem>
              <MenuItem value="PNG">PNG</MenuItem>
              <MenuItem value="PDF">PDF</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <FormControl fullWidth>
            <InputLabel shrink>Size</InputLabel>
            <Select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              label="Size"
            >
              <MenuItem value="1x">1 x (1280 × 720 px)</MenuItem>
              <MenuItem value="2x">2 x (2560 × 1440 px)</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <FormControl fullWidth>
            <InputLabel shrink>Select pages</InputLabel>
            <Select
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              label="Select pages"
            >
              <MenuItem value="Current page only">Current page only</MenuItem>
              <MenuItem value="All pages">All pages</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <FormControlLabel
          control={
            <Switch checked={includebackground} onChange={handleChange} />
          }
          label="Background"
        />
      </Box>
      <Button
        variant="contained"
        onClick={handleDownloadClick}
        sx={{
          backgroundColor: "#0c7a92",
          color: "#fff",
          width: "100%",
          marginTop: 2,
          "&:hover": {
            backgroundColor: "#333",
          },
        }}
      >
        Download
      </Button>
    </Box>
  );
};

export default DownloadPanel;
