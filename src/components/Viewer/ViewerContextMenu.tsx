import React from "react";
import {
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Divider,
  Paper,
  ListItemSecondaryAction,
} from "@mui/material";
import {
  CenterFocusWeak,
  DirectionsCarFilled,
  RestartAlt,
  Sensors,
  RotateRight,
  GridOn,
  BugReport,
} from "@mui/icons-material";
import useGlobalConfigStore from "../../stores/globalConfigStore";

interface ViewerContextMenuProps {
  contextMenuPos: { mouseX: number; mouseY: number } | null;
  handleCloseContextMenu: () => void;
  handleReset: () => void;
  handleCenter: () => void;
  handleAutoZoom: () => void;
  handleAutoZoomToSensorCoverage: () => void;
  handleRotateClockwise: () => void;
}

const ViewerContextMenu: React.FC<ViewerContextMenuProps> = ({
  contextMenuPos,
  handleCloseContextMenu,
  handleReset,
  handleCenter,
  handleAutoZoom,
  handleAutoZoomToSensorCoverage,
  handleRotateClockwise,
}) => {
  const { layerVisibility, toggleLayerVisibility } = useGlobalConfigStore();

  return (
    <Paper sx={{ width: 320, maxWidth: "100%" }}>
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
        <MenuItem onClick={handleReset}>
          <ListItemIcon>
            <RestartAlt fontSize="small" />
          </ListItemIcon>
          <ListItemText>Reset View</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleCenter}>
          <ListItemIcon>
            <CenterFocusWeak fontSize="small" />
          </ListItemIcon>
          <ListItemText>Centering View</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleAutoZoom}>
          <ListItemIcon>
            <DirectionsCarFilled fontSize="small" />
          </ListItemIcon>
          <ListItemText>Fit Vehicle</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleAutoZoomToSensorCoverage}>
          <ListItemIcon>
            <Sensors fontSize="small" />
          </ListItemIcon>
          <ListItemText>Fit Sensor Range</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleRotateClockwise}>
          <ListItemIcon>
            <RotateRight fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rotate</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => toggleLayerVisibility("showGrid")}>
          <ListItemIcon>
            <GridOn fontSize="small" />
          </ListItemIcon>
          <ListItemText>Show Grid</ListItemText>
          <ListItemSecondaryAction>
            <Checkbox
              edge="end"
              checked={layerVisibility.showGrid}
              onChange={() => toggleLayerVisibility("showGrid")}
            />
          </ListItemSecondaryAction>
        </MenuItem>

        <MenuItem onClick={() => toggleLayerVisibility("showDebugMode")}>
          <ListItemIcon>
            <BugReport fontSize="small" />
          </ListItemIcon>
          <ListItemText>Debug Mode</ListItemText>
          <ListItemSecondaryAction>
            <Checkbox
              edge="end"
              checked={layerVisibility.showDebugMode}
              onChange={() => toggleLayerVisibility("showDebugMode")}
            />
          </ListItemSecondaryAction>
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default ViewerContextMenu;
