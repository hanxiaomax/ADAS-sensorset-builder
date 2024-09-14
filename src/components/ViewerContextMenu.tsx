import React from "react";
import {
  Menu,
  MenuItem,
  ListItemText,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  CenterFocusWeak,
  DirectionsCarFilled,
  RestartAlt,
  Sensors,
  RotateRight, // 引入旋转图标
} from "@mui/icons-material";

interface ViewerContextMenuProps {
  contextMenuPos: { mouseX: number; mouseY: number } | null;
  handleCloseContextMenu: () => void;
  handleToggleGrid: () => void;
  handleReset: () => void;
  handleCenter: () => void;
  handleAutoZoom: () => void;
  handleAutoZoomToSensorCoverage: () => void;
  handleRotateClockwise: () => void; // 顺时针旋转回调
  uiConfig: any;
}

const ViewerContextMenu: React.FC<ViewerContextMenuProps> = ({
  contextMenuPos,
  handleCloseContextMenu,
  handleToggleGrid,
  handleReset,
  handleCenter,
  handleAutoZoom,
  handleAutoZoomToSensorCoverage,
  handleRotateClockwise,
  uiConfig,
}) => {
  return (
    <Menu
      open={contextMenuPos !== null}
      onClose={handleCloseContextMenu}
      anchorReference="anchorPosition"
      anchorPosition={
        contextMenuPos !== null
          ? { top: contextMenuPos.mouseY, left: contextMenuPos.mouseX }
          : undefined
      }
    >
      <MenuItem onClick={handleToggleGrid}>
        <FormControlLabel
          control={<Checkbox checked={uiConfig.showGrid} />}
          label="Show Grid"
        />
      </MenuItem>
      <MenuItem onClick={handleReset}>
        <RestartAlt />
        <ListItemText sx={{ ml: 1 }}>Reset View</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleCenter}>
        <CenterFocusWeak />
        <ListItemText sx={{ ml: 1 }}>Centering View</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleAutoZoom}>
        <DirectionsCarFilled />
        <ListItemText sx={{ ml: 1 }}>Fit Vehicle</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleAutoZoomToSensorCoverage}>
        <Sensors />
        <ListItemText sx={{ ml: 1 }}>Fit Sensor Range</ListItemText>
      </MenuItem>
      {/* 新增旋转功能 */}
      <MenuItem onClick={handleRotateClockwise}>
        <RotateRight />
        <ListItemText sx={{ ml: 1 }}>Rotate</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default ViewerContextMenu;
