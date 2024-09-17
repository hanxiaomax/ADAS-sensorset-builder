import React, { useEffect, useRef, useState } from "react";
import { Grid, Box, Paper, Typography, IconButton } from "@mui/material";
import { Stage, Layer, Group, Text } from "react-konva";
import CarImage from "./carImage";
import UssZones from "./UssZones";
import { SensorBlock } from "./Sensors";
import Marker from "../utils";
import { StageSize } from "../../types/Common";
import Sensor from "../../types/Sensor";
import { Vehicle } from "../../types/Vehicle";
import Konva from "konva";
import ViewerContextMenu from "./ViewerContextMenu"; // 引入 ViewerContextMenu
import CloseIcon from "@mui/icons-material/Close";
import Draggable from "react-draggable"; // 用于拖动浮动窗口
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"; // 拖动指示图标

import {
  getBoundingBox,
  getSensorCoverageBoundingBox,
  renderBoundingBox,
  renderDebugOverlay,
  renderGrid,
  renderLayerBoundary,
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
  const stageCenter = {
    x: stageSize.width / 2,
    y: stageSize.height / 2,
  };
  const [scale, setScale] = useState(1);
  const [girdMargin, setGirdMargin] = useState(10000);
  const [contextMenuPos, setContextMenuPos] = useState<null | {
    mouseX: number;
    mouseY: number;
  }>(null);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null); // 选中的传感器
  const [rotation, setRotation] = useState(0);
  const layerRef = useRef<Konva.Layer>(null);
  const [layerSize, setLayerSize] = useState({ width: 0, height: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [stagePos, setStagePos] = useState(stageCenter);
  const [floatingWindowPos, setFloatingWindowPos] = useState({ x: 0, y: 0 }); // 窗口的位置
  const [showSensorInfo, setShowSensorInfo] = useState(false); // 控制浮动窗口的显示

  useEffect(() => {
    if (layerRef.current) {
      const layer = layerRef.current;
      const width = layer.width(); // 获取Layer的宽度
      const height = layer.height(); // 获取Layer的高度
      setLayerSize({ width, height });
    }
  }, []);

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

    const oldScale = scale; // 使用 Layer 的 scale
    const pointer = stage.getPointerPosition();
    const zoomFactor = e.evt.deltaY > 0 ? 0.9 : 1.1;
    const newScale = oldScale * zoomFactor;

    const mousePointTo = {
      x: (pointer!.x - stagePos.x) / oldScale,
      y: (pointer!.y - stagePos.y) / oldScale,
    };

    const newPos = {
      x: pointer!.x - mousePointTo.x * newScale,
      y: pointer!.y - mousePointTo.y * newScale,
    };

    setScale(newScale); // 更新缩放比例
    setStagePos(newPos); // 更新图层位置
  };

  const handleToggleGrid = () => {
    setUiConfig((prev: any) => ({
      ...prev,
      showGrid: !prev.showGrid,
    }));
  };

  const handelToggleDebugMode = () => {
    setUiConfig((prev: any) => ({
      ...prev,
      showDebugMode: !prev.showDebugMode,
    }));
  };
  const handleAutoZoomToSensorCoverage = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const bbox = getSensorCoverageBoundingBox(sensorConfiguration);

    const scaleX = stageSize.width / bbox.width;
    const scaleY = stageSize.height / bbox.height;
    const newScale = Math.min(scaleX, scaleY) * 0.95; // 留一点边距
    setScale(newScale);
    setStagePos(stageCenter);

    handleCloseContextMenu(); // 关闭右键菜单
  };

  // 自动缩放到适合的大小
  const handleAutoZoom = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const bbox = getBoundingBox(vehicle);

    const scaleX = stageSize.width / bbox.width;
    const scaleY = stageSize.height / bbox.height;

    const newScale = Math.min(scaleX, scaleY) * 0.9; // 留一点边距

    setScale(newScale);
    setStagePos(stageCenter);

    handleCloseContextMenu(); // 关闭右键菜单
  };

  const handleReset = () => {
    setScale(1);
    setStagePos(stageCenter);
    handleCloseContextMenu();
  };

  const handleRotateClockwise = () => {
    const stage = stageRef.current;
    if (!stage) return;
    setRotation((prevRotation) => prevRotation + 90); // 顺时针旋转90°
    handleCloseContextMenu(); // 关闭右键菜单
  };

  const handleCenter = () => {
    const stage = stageRef.current;
    if (!stage) return;
    setStagePos(stageCenter);
    handleCloseContextMenu(); // 关闭右键菜单
  };

  const handleDragMove = (e: any) => {
    setStagePos({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  // 添加鼠标移动事件监听
  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (stage) {
      const pointerPos = stage.getPointerPosition();
      setMousePos(pointerPos || { x: 0, y: 0 });
    }
  };

  const handleSensorClick = (
    sensor: Sensor,
    event: Konva.KonvaEventObject<MouseEvent>
  ) => {
    setSelectedSensor(sensor); // 设置为选中的传感器
    setFloatingWindowPos({
      x: event.evt.clientX + 20, // 动态设置浮动窗口的位置，传感器附近
      y: event.evt.clientY + 20,
    });
    setShowSensorInfo(true); // 显示浮动窗口
  };

  const handleCloseSensorInfo = () => {
    setShowSensorInfo(false);
    setSelectedSensor(null); // 关闭时取消选中传感器
  };

  const renderDebugInfo = () => {
    if (!uiConfig.showDebugMode) return null;

    const selectedSensorInfo = selectedSensor;

    return (
      <Text
        x={10}
        y={10}
        fontSize={18}
        fontFamily="Courier New"
        fill="black"
        lineHeight={1}
        text={`
    Debug Information:

    Stage:
    Width: ${stageSize.width}
    Height: ${stageSize.height}
    Center: (${stageCenter.x}, ${stageCenter.y})

    Layer:
    Width: ${layerSize.width}
    Height: ${layerSize.height}
    Scale: ${scale.toFixed(2)}

    BoundingBox:
    X: ${stagePos.x.toFixed(2)}
    Y: ${stagePos.y.toFixed(2)}
    Rotation: ${rotation}°

    Mouse Position:
    X: ${mousePos.x.toFixed(2)}
    Y: ${mousePos.y.toFixed(2)}

    ${
      selectedSensorInfo
        ? `
    Selected Sensor:
    ID: ${selectedSensorInfo.id}
    Name: ${selectedSensorInfo.sensorInfo.name}
    Type: ${selectedSensorInfo.sensorInfo.type}
    Mounting: ${selectedSensorInfo.mountPosition.name}
    Range: ${selectedSensorInfo.sensorInfo.spec.range} m
    FOV: ${selectedSensorInfo.sensorInfo.spec.fov} °
    `
        : "No sensor selected"
    }
        `}
        align="left"
      />
    );
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
            scaleX={1}
            scaleY={1}
            x={0}
            y={0}
            draggable={false}
            onWheel={handleWheel}
            onMouseMove={handleMouseMove}
          >
            <Layer>
              {uiConfig.showDebugMode && renderDebugOverlay(stageSize)}
            </Layer>
            <Layer
              listening={false}
              scaleX={scale}
              scaleY={scale}
              x={stageCenter.x}
              y={stageCenter.y}
              offsetX={stageSize.width / 2}
              offsetY={stageSize.height / 2}
            >
              {uiConfig.showGrid && renderGrid(stageSize, girdMargin)}
            </Layer>
            <Layer
              scaleX={scale}
              scaleY={scale}
              x={stagePos.x}
              y={stagePos.y}
              draggable
              onDragMove={handleDragMove}
              ref={layerRef}
              rotation={rotation}
              offsetX={stageSize.width / 2}
              offsetY={stageSize.height / 2}
            >
              {uiConfig.showDebugMode && renderBoundingBox(sensorConfiguration)}
              {uiConfig.showDebugMode && renderLayerBoundary(layerSize)}

              <Group>
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
                {sensorConfiguration.map((sensor) => (
                  <SensorBlock
                    key={sensor.id}
                    sensor={sensor}
                    uiConfig={uiConfig}
                    onClick={(e) => handleSensorClick(sensor, e)}
                    isSelected={selectedSensor?.id === sensor.id}
                  />
                ))}
              </Group>
            </Layer>

            <Layer>{renderDebugInfo()}</Layer>
          </Stage>

          <ViewerContextMenu
            contextMenuPos={contextMenuPos}
            handleCloseContextMenu={handleCloseContextMenu}
            handleToggleGrid={handleToggleGrid}
            handleReset={handleReset}
            handleCenter={handleCenter}
            handleAutoZoom={handleAutoZoom}
            handleAutoZoomToSensorCoverage={handleAutoZoomToSensorCoverage}
            handleRotateClockwise={handleRotateClockwise}
            handleToggleDebugMode={handelToggleDebugMode}
            uiConfig={uiConfig}
          />
        </Box>

        {showSensorInfo && selectedSensor && (
          <Draggable>
            <Paper
              elevation={3}
              sx={{
                position: "absolute",
                top: floatingWindowPos.y,
                left: floatingWindowPos.x,
                padding: 0,
                width: 300,
                zIndex: 2000,
                cursor: "move",
                border: "2px solid #ccc",
                "&:hover": {
                  cursor: "pointer", // 鼠标悬停时变为小手
                },
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  backgroundColor: "#f0f0f0",
                  padding: 1,
                  cursor: "move",
                  borderBottom: "1px solid #ccc",
                }}
              >
                <Box display="flex" alignItems="center">
                  <DragIndicatorIcon sx={{ marginRight: 1 }} />{" "}
                  {/* 拖动指示图标 */}
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Sensor Information
                  </Typography>
                </Box>
                <IconButton size="small" onClick={handleCloseSensorInfo}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box sx={{ padding: 2 }}>
                <Typography variant="body1">
                  <strong>ID:</strong> {selectedSensor.id}
                </Typography>
                <Typography variant="body1">
                  <strong>Name:</strong> {selectedSensor.sensorInfo.name}
                </Typography>
                <Typography variant="body1">
                  <strong>Type:</strong> {selectedSensor.sensorInfo.type}
                </Typography>
                <Typography variant="body1">
                  <strong>Range:</strong> {selectedSensor.sensorInfo.spec.range}{" "}
                  m
                </Typography>
                <Typography variant="body1">
                  <strong>FOV:</strong> {selectedSensor.sensorInfo.spec.fov} °
                </Typography>
                <Typography variant="body1">
                  <strong>Mounting:</strong> {selectedSensor.mountPosition.name}
                </Typography>
              </Box>
            </Paper>
          </Draggable>
        )}
      </Grid>
    </Grid>
  );
};

export default Viewer;
