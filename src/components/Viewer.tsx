import React, { useState } from "react";
import { Grid, Box } from "@mui/material";
import { Stage, Layer, Line, Circle, Rect, Group } from "react-konva";
import CarImage from "./carImage";
import UssZones from "./UssZones";
import { SensorBlock } from "./Sensors";
import Marker, { mountStringToPosition } from "./utils";
import {
  MountPosition,
  Sensor,
  SENSOR_RANGE_FACTOR,
  StageSize,
} from "../types/Common";
import { Vehicle } from "../types/Vehicle";
import Konva from "konva";
import ViewerContextMenu from "./ViewerContextMenu"; // 引入 ViewerContextMenu
import {
  getBoundingBox,
  getSensorCoverageBoundingBox,
  renderDebugOverlay,
  renderGrid,
} from "./ViewerHelper";

interface ViewerProps {
  stageSize: StageSize;
  vehicle: Vehicle;
  sensorConfiguration: Sensor[];
  uiConfig: any;
  setUiConfig: (config: any) => void;
  stageRef: React.RefObject<Konva.Stage>;
}

const Viewer: React.FC<ViewerProps> = ({
  stageSize,
  vehicle,
  sensorConfiguration,
  uiConfig,
  setUiConfig,
  stageRef,
}) => {
  const [scale, setScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [girdMargin, setGirdMargin] = useState(10000);
  const [contextMenuPos, setContextMenuPos] = useState<null | {
    mouseX: number;
    mouseY: number;
  }>(null);
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

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

    const { minX, minY, maxX, maxY } =
      getSensorCoverageBoundingBox(sensorConfiguration);
    setGirdMargin(Math.max(maxX, maxY) * 5);
  };

  const handleToggleGrid = () => {
    setUiConfig((prev: any) => ({
      ...prev,
      showGrid: !prev.showGrid,
    }));
  };

  const handleAutoZoomToSensorCoverage = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const { minX, minY, maxX, maxY } =
      getSensorCoverageBoundingBox(sensorConfiguration);
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    const scaleX = stageSize.width / contentWidth;
    const scaleY = stageSize.height / contentHeight;
    const newScale = Math.min(scaleX, scaleY) * 0.9; // 留一点边距

    const newPos = {
      x: (stageSize.width - contentWidth * newScale) / 2 - minX * newScale,
      y: (stageSize.height - contentHeight * newScale) / 2 - minY * newScale,
    };

    setScale(newScale);
    setStagePos(newPos);

    handleCloseContextMenu(); // 关闭右键菜单
  };

  const handleSensorClick = (sensorId: string) => {
    if (selectedSensor === sensorId) {
      setSelectedSensor(null);
    } else {
      setSelectedSensor(sensorId);
    }
  };

  // 自动缩放到适合的大小
  const handleAutoZoom = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const { minX, minY, maxX, maxY } = getBoundingBox(
      sensorConfiguration,
      vehicle
    );
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    const scaleX = stageSize.width / contentWidth;
    const scaleY = stageSize.height / contentHeight;
    const newScale = Math.min(scaleX, scaleY) * 0.9; // 留一点边距

    const newPos = {
      x: (stageSize.width - contentWidth * newScale) / 2 - minX * newScale,
      y: (stageSize.height - contentHeight * newScale) / 2 - minY * newScale,
    };

    setScale(newScale);
    setStagePos(newPos);

    handleCloseContextMenu(); // 关闭右键菜单
  };

  const handleReset = () => {
    setScale(1);
    setStagePos({ x: 0, y: 0 });
    handleCloseContextMenu();
  };

  const handleRotateClockwise = () => {
    const stage = stageRef.current;
    if (!stage) return;

    // 获取舞台中心点
    const stageCenter = {
      x: stage.width() / 2,
      y: stage.height() / 2,
    };

    // 获取当前舞台的偏移位置
    const stagePosX = stage.x();
    const stagePosY = stage.y();

    // 计算旋转后的偏移位置
    const newPosX = stageCenter.x + (stagePosY - stageCenter.y);
    const newPosY = stageCenter.y - (stagePosX - stageCenter.x);

    setRotation((prevRotation) => prevRotation + 90); // 顺时针旋转90°
    setStagePos({ x: newPosX, y: newPosY });
    handleCenter();
  };

  const handleRotateCounterClockwise = () => {
    const stage = stageRef.current;
    if (!stage) return;

    // 获取舞台中心点
    const stageCenter = {
      x: stage.width() / 2,
      y: stage.height() / 2,
    };

    // 获取当前舞台的偏移位置
    const stagePosX = stage.x();
    const stagePosY = stage.y();

    // 计算逆时针旋转后的偏移位置
    const newPosX = stageCenter.x - (stagePosY - stageCenter.y);
    const newPosY = stageCenter.y + (stagePosX - stageCenter.x);

    setRotation((prevRotation) => prevRotation - 90); // 逆时针旋转90°
    setStagePos({ x: newPosX, y: newPosY });
  };
  const handleCenter = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const stageCenter = {
      x: stage.width() / 2,
      y: stage.height() / 2,
    };

    const vehicleCenter = {
      x: vehicle.origin.x * scale + vehicle.width / 2,
      y: vehicle.origin.y * scale + vehicle.length / 2,
    };

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
            onWheel={handleWheel}
            rotation={rotation}
            onDragMove={handleDragMove}
          >
            <Layer>{renderDebugOverlay(stageSize)}</Layer>
            <Layer listening={false} scaleX={1} scaleY={1} x={0} y={0}>
              {uiConfig.showGrid && renderGrid(stageSize, girdMargin)}
            </Layer>
            <Layer>
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
              {uiConfig.showVehicleRefPoint &&
                Object.values(vehicle.refPoints).map((position, index) => (
                  <Marker key={index} position={position} fill="red" />
                ))}
              {sensorConfiguration.map((sensor, index) => (
                <SensorBlock
                  key={index}
                  sensor={sensor}
                  uiConfig={uiConfig}
                  onClick={() => handleSensorClick(sensor.id)}
                  isSelected={selectedSensor === sensor.id}
                />
              ))}
            </Layer>
          </Stage>

          {/* 独立的右键菜单 */}
          <ViewerContextMenu
            contextMenuPos={contextMenuPos}
            handleCloseContextMenu={handleCloseContextMenu}
            handleToggleGrid={handleToggleGrid}
            handleReset={handleReset}
            handleCenter={handleCenter}
            handleAutoZoom={handleAutoZoom}
            handleAutoZoomToSensorCoverage={handleAutoZoomToSensorCoverage}
            handleRotateClockwise={handleRotateClockwise}
            handleRotateCounterClockwise={handleRotateCounterClockwise}
            uiConfig={uiConfig}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Viewer;
