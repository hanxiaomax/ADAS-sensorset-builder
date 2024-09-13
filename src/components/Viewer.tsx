import React, { useState } from "react";
import { Grid, Box, Menu, MenuItem, ListItemText } from "@mui/material";
import { Stage, Layer } from "react-konva";
import CarImage from "./carImage";
import UssZones from "./UssZones";
import { SensorBlock } from "./Sensors";
import Marker from "./utils";
import { Sensor } from "../types/Common";
import { Vehicle } from "../types/Vehicle";
import Konva from "konva"; // 引入 Konva
import { CenterFocusWeak, RestartAlt } from "@mui/icons-material";

interface ViewerProps {
  stageSize: { width: number; height: number };
  vehicle: Vehicle;
  sensorConfiguration: Sensor[];
  uiConfig: any;
  stageRef: React.RefObject<Konva.Stage>;
}

const Viewer: React.FC<ViewerProps> = ({
  stageSize,
  vehicle,
  sensorConfiguration,
  uiConfig,
  stageRef,
}) => {
  const [scale, setScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [contextMenuPos, setContextMenuPos] = useState<null | {
    mouseX: number;
    mouseY: number;
  }>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenuPos({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenuPos(null);
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    const zoomFactor = e.evt.deltaY > 0 ? 0.9 : 1.1;
    const newScale = oldScale * zoomFactor;

    const mousePointTo = {
      x: (pointer!.x - stage.x()) / oldScale,
      y: (pointer!.y - stage.y()) / oldScale,
    };

    const newPos = {
      x: pointer!.x - mousePointTo.x * newScale,
      y: pointer!.y - mousePointTo.y * newScale,
    };

    setScale(newScale);
    setStagePos(newPos);
  };

  const handleReset = () => {
    setScale(1);
    setStagePos({ x: 0, y: 0 });
    handleCloseContextMenu();
  };

  const handleCenter = () => {
    const stage = stageRef.current;
    if (!stage) return;

    // 计算屏幕的中心点
    const stageCenter = {
      x: stage.width() / 2,
      y: stage.height() / 2,
    };

    // 计算车辆的中心点
    const vehicleCenter = {
      x: vehicle.origin.x * scale + vehicle.width / 2,
      y: vehicle.origin.y * scale + vehicle.length / 2,
    };

    // 调整舞台位置以将车辆居中
    const newPos = {
      x: stageCenter.x - vehicleCenter.x,
      y: stageCenter.y - vehicleCenter.y,
    };

    setStagePos(newPos);
    handleCloseContextMenu();
  };

  const handleDragMove = (e: any) => {
    setStagePos({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  return (
    <Grid
      container
      sx={{ width: "80vw", height: "100vh", margin: "auto", mt: 4, mb: 2 }}
      onContextMenu={handleContextMenu}
    >
      <Grid item xs={12} container justifyContent="center" alignItems="center">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            width: "100%",
            height: "100%",
            zIndex: 1000,
            position: "relative",
          }}
        >
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            ref={stageRef}
            scaleX={scale}
            scaleY={scale}
            x={stagePos.x}
            y={stagePos.y}
            draggable
            onDragMove={handleDragMove}
            onWheel={handleWheel}
          >
            <UssZones
              show={uiConfig.showUssZones}
              x={vehicle.origin.x}
              y={vehicle.origin.y}
              carWidth={vehicle.width}
              carLength={vehicle.length}
              frontOverhang={vehicle.frontOverhang}
              rearOverhang={vehicle.rearOverhang}
              frontZones={uiConfig.frontZones}
              rearZones={uiConfig.rearZones}
              sideZones={uiConfig.sideZones}
            />
            <CarImage
              show={uiConfig.showCarImage}
              x={vehicle.origin.x}
              y={vehicle.origin.y}
              width={vehicle.width}
              height={vehicle.length}
              image={vehicle.image}
            />
            <Layer>
              {uiConfig.showVehicleRefPoint &&
                Object.values(vehicle.refPoints).map((position, index) => (
                  <Marker key={index} position={position} fill="red" />
                ))}
              {sensorConfiguration.map((sensor, index) => (
                <SensorBlock key={index} sensor={sensor} uiConfig={uiConfig} />
              ))}
            </Layer>
          </Stage>

          {/* 右键菜单 */}
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
              <RestartAlt />
              <ListItemText sx={{ ml: 1 }}>Reset View</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleCenter}>
              <CenterFocusWeak />
              <ListItemText sx={{ ml: 1 }}>Centering</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Viewer;
