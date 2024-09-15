import React, { useEffect, useRef, useState } from "react";
import { Grid, Box } from "@mui/material";
import { Stage, Layer, Line, Circle, Rect, Group } from "react-konva";
import CarImage from "./carImage";
import UssZones from "./UssZones";
import { SensorBlock } from "./Sensors";
import Marker from "./utils";
import { Sensor, StageSize } from "../types/Common";
import { Vehicle } from "../types/Vehicle";
import Konva from "konva";
import ViewerContextMenu from "./ViewerContextMenu"; // 引入 ViewerContextMenu
import {
  calculateNewOrigin,
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
            <Layer>{renderDebugOverlay(stageSize)}</Layer>
            <Layer
              listening={false}
              scaleX={scale}
              scaleY={scale}
              x={stagePos.x}
              y={stagePos.y}
              offsetX={stageSize.width / 2}
              offsetY={stageSize.height / 2}
            >
              {uiConfig.showGrid && renderGrid(stageSize, girdMargin)}
            </Layer>
            {/* 
            1. move origin to center 
            2. x/y is the coordination of center,so set
            it to stage center will draw layer on stage center
            3. now the rotation is also ref the center of layer
            */}
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
              {renderBoundingBox(sensorConfiguration)}
              {renderLayerBoundary(layerSize)}

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
                {sensorConfiguration.map((sensor, index) => (
                  <SensorBlock
                    key={index}
                    sensor={sensor}
                    uiConfig={uiConfig}
                    onClick={() => handleSensorClick(sensor.id)}
                    isSelected={selectedSensor === sensor.id}
                  />
                ))}
              </Group>
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
            uiConfig={uiConfig}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Viewer;
