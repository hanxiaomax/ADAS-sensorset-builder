import React from "react";
import {
  Box,
  Typography,
  FormControlLabel,
  Switch,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface LayerControl {
  name: string; // 图层的名称
  visible: boolean; // 图层是否可见
  toggleVisibility: () => void; // 切换图层可见性的函数
  controls?: React.ReactNode; // 图层的控制参数节点
}

interface ControlPanelProps {
  layers: LayerControl[]; // 接收一个图层控制项的数组
  onClose: () => void; // 关闭面板的回调函数
}

const ControlPanel: React.FC<ControlPanelProps> = ({ layers, onClose }) => {
  return (
    <Box
      width="250px"
      bgcolor="white"
      padding={2}
      borderRadius={4}
      boxShadow={3}
      position="absolute"
      top={16}
      right={16}
    >
      {/* 右上角关闭按钮 */}
      <IconButton
        onClick={onClose}
        style={{ position: "absolute", top: 8, right: 8 }}
        size="small"
      >
        <CloseIcon />
      </IconButton>

      <Typography variant="h6">图层控制</Typography>
      {layers.map((layer, index) => (
        <div key={index}>
          <FormControlLabel
            control={
              <Switch
                checked={layer.visible}
                onChange={layer.toggleVisibility}
                color="primary"
              />
            }
            label={`显示 ${layer.name}`}
          />
          {layer.visible && layer.controls}
        </div>
      ))}
    </Box>
  );
};

export default ControlPanel;
