import React from "react";
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ControlPanelProps {
  showUssZones: boolean;
  showCarImage: boolean;
  showUssSensors: boolean;
  setShowUssZones: React.Dispatch<React.SetStateAction<boolean>>;
  setShowCarImage: React.Dispatch<React.SetStateAction<boolean>>;
  setShowUssSensors: React.Dispatch<React.SetStateAction<boolean>>;
  frontZones: number;
  sideZones: number;
  rearZones: number;
  setFrontZones: React.Dispatch<React.SetStateAction<number>>;
  setSideZones: React.Dispatch<React.SetStateAction<number>>;
  setRearZones: React.Dispatch<React.SetStateAction<number>>;
  onClose: () => void; // 新增关闭面板的回调函数
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  showUssZones,
  showCarImage,
  showUssSensors,
  setShowUssZones,
  setShowCarImage,
  setShowUssSensors,
  frontZones,
  sideZones,
  rearZones,
  setFrontZones,
  setSideZones,
  setRearZones,
  onClose,
}) => {
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
      <FormControlLabel
        control={
          <Switch
            checked={showUssZones}
            onChange={() => setShowUssZones(!showUssZones)}
            color="primary"
          />
        }
        label="显示 USS 区域"
      />
      <FormControlLabel
        control={
          <Switch
            checked={showCarImage}
            onChange={() => setShowCarImage(!showCarImage)}
            color="primary"
          />
        }
        label="显示车辆图像"
      />
      <FormControlLabel
        control={
          <Switch
            checked={showUssSensors}
            onChange={() => setShowUssSensors(!showUssSensors)}
            color="primary"
          />
        }
        label="显示超声波传感器"
      />

      <Typography variant="h6" style={{ marginTop: "16px" }}>
        区域设置
      </Typography>
      <TextField
        label="Front Zones Numbers"
        type="number"
        variant="outlined"
        value={frontZones}
        onChange={(e) => setFrontZones(parseInt(e.target.value))}
        margin="normal"
        fullWidth
      />
      <TextField
        label="Side Zone Numbers"
        type="number"
        variant="outlined"
        value={sideZones}
        onChange={(e) => setSideZones(parseInt(e.target.value))}
        margin="normal"
        fullWidth
      />
      <TextField
        label="Rear Zones Numbers"
        type="number"
        variant="outlined"
        value={rearZones}
        onChange={(e) => setRearZones(parseInt(e.target.value))}
        margin="normal"
        fullWidth
      />
    </Box>
  );
};

export default ControlPanel;
