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
  RestartAlt,
  RotateRight,
  GridOn,
  BugReport,
} from "@mui/icons-material";
import useGlobalConfigStore from "../../stores/globalConfigStore";
import { useSceneStore } from "../../stores/sceneStore";
import {
  getBoundingBox,
  getSensorCoverageBoundingBox,
} from "../Viewer/ViewerHelper";
import { Stage } from "konva/lib/Stage";

interface ViewerContextMenuProps {
  contextMenuPos: { mouseX: number; mouseY: number } | null;
  stageRef: React.RefObject<Stage>;
  stageSize: { width: number; height: number };
  stageCenter: { x: number; y: number };
}

const ViewerContextMenu: React.FC<ViewerContextMenuProps> = ({
  contextMenuPos,
  stageRef,
  stageSize,
  stageCenter,
}) => {
  const { layerVisibility, toggleLayerVisibility } = useGlobalConfigStore();
  const {
    scale,
    setScale,
    setStagePos,
    rotation,
    setRotation,
    sensors,
    vehicle,
  } = useSceneStore();

  const handleCloseContextMenu = () => {
    const closeEvent = new CustomEvent("closeContextMenu");
    window.dispatchEvent(closeEvent);
  };

  const handleReset = () => {
    setScale(1);
    setStagePos(stageCenter);
    handleCloseContextMenu();
  };

  const handleCenter = () => {
    const stage = stageRef.current;
    if (!stage) return;
    setStagePos(stageCenter);
    handleCloseContextMenu();
  };

  const handleRotateClockwise = () => {
    const stage = stageRef.current;
    if (!stage) return;
    setRotation(rotation + 90);
    handleCloseContextMenu();
  };

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
        PaperProps={{
          sx: {
            width: 320,
            maxWidth: "100%",
          },
        }}
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
