import React, { useEffect, useRef, useState } from "react";
import { Grid, Box } from "@mui/material";
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
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const layerRef = useRef<Konva.Layer>(null);
  const [layerSize, setLayerSize] = useState({ width: 0, height: 0 });

  const [stagePos, setStagePos] = useState(stageCenter);

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

    // 计算鼠标相对于 Layer 的位置
    const mousePointTo = {
      x: (pointer!.x - stagePos.x) / oldScale,
      y: (pointer!.y - stagePos.y) / oldScale,
    };

    // 更新 Layer 的位置，以确保缩放以鼠标为中心
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

  const renderDebugInfo = () => {
    if (!uiConfig.showDebugMode) return null;

    // 查找选中的传感器
    const selectedSensorInfo = sensorConfiguration.find(
      (sensor) => sensor.id === selectedSensor
    );

    return (
      <Text
        x={10}
        y={10}
        fontSize={18}
        fontFamily="Courier New" // 使用等宽字体
        fill="black" // 字体颜色
        lineHeight={1} // 行高
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

    ${
      selectedSensorInfo
        ? `
    Selected Sensor:
    ID: ${selectedSensorInfo.id}
    Name: ${selectedSensorInfo.sensorInfo.name}
    Type: ${selectedSensorInfo.sensorInfo.type}
    Mounting:${selectedSensorInfo.mountPosition.name}
    Range: ${selectedSensorInfo.sensorInfo.spec.range} m
    FOV: ${selectedSensorInfo.sensorInfo.spec.fov} °
    `
        : "No sensor selected"
    }
        `}
        align="left" // 左对齐
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
            scaleX={1} // 固定 Stage 不进行缩放
            scaleY={1}
            x={0} // 禁止 Stage 的拖动
            y={0}
            draggable={false} // 禁用 Stage 的拖动
            onWheel={handleWheel} // 使用鼠标缩放
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
              draggable // 仅允许 Layer 拖动
              onDragMove={handleDragMove} // 拖动事件
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
                    key={sensor.id} // 使用传感器的唯一 ID 作为 key
                    sensor={sensor}
                    uiConfig={uiConfig}
                    onClick={() => handleSensorClick(sensor.id)}
                    isSelected={selectedSensor === sensor.id}
                  />
                ))}
              </Group>
            </Layer>

            {/* 显示调试信息 */}
            <Layer>{renderDebugInfo()}</Layer>
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
            handleToggleDebugMode={handelToggleDebugMode}
            uiConfig={uiConfig}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Viewer;
