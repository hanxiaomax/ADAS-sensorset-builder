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
  RotateRight, // 引入旋转图标
  GridOn,
  BugReport,
  Save,
  UploadFile,
} from "@mui/icons-material";
import useGlobalConfigStore from "../../stores/globalConfigStore";
import { useSceneStore } from "../../stores/sceneStore";

interface ViewerContextMenuProps {
  contextMenuPos: { mouseX: number; mouseY: number } | null;
  handleCloseContextMenu: () => void;
  handleReset: () => void;
  handleCenter: () => void;
  handleAutoZoom: () => void;
  handleAutoZoomToSensorCoverage: () => void;
  handleRotateClockwise: () => void; // 顺时针旋转回调
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
  const { scale, stagePos, rotation, sensors, selectedSensor } =
    useSceneStore();

  const handleSaveScene = () => {
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

    handleCloseContextMenu();
  };

  const handleLoadScene = () => {
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
        } catch (error) {
          console.error("Error loading scene:", error);
          alert("Failed to load scene configuration file");
        }
      };
      reader.readAsText(file);
    };

    input.click();
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

        <MenuItem onClick={handleSaveScene}>
          <ListItemIcon>
            <Save fontSize="small" />
          </ListItemIcon>
          <ListItemText>Save Scene</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleLoadScene}>
          <ListItemIcon>
            <UploadFile fontSize="small" />
          </ListItemIcon>
          <ListItemText>Load Scene</ListItemText>
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default ViewerContextMenu;
