import React, { useEffect, useRef, useState } from "react";
import {
  Grid,
  Box,
  Paper,
  Typography,
  IconButton,
  CardMedia,
  Table,
  TableBody,
  Tooltip,
  TableCell,
  TableRow,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Stage, Layer, Group, Text, Line } from "react-konva";
import CarImage from "./carImage";
import UssZones from "./UssZones";
import { SensorBlock } from "./Sensors";
import Marker from "../utils";
import { StageSize } from "../../types/Common";
import Sensor from "../../types/Sensor";
import { Vehicle } from "../../types/Vehicle";
import Konva from "konva";
import ViewerContextMenu from "./ViewerContextMenu";
import CloseIcon from "@mui/icons-material/Close";
import Draggable from "react-draggable"; // 用于拖动浮动窗口
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import MenuIcon from "@mui/icons-material/Menu";
import { Settings, ImportExport, Help, GitHub } from "@mui/icons-material";
import HamburgerMenu from "./HamburgerMenu";

import {
  getBoundingBox,
  getSensorCoverageBoundingBox,
  renderBoundingBox,
  renderDebugOverlay,
  renderGrid,
  renderLayerBoundary,
} from "./ViewerHelper";
import { useSensorStore, SensorStoreState } from "../../stores/sensorStore";
import useGlobalConfigStore from "../../stores/globalConfigStore";
import { useSceneStore } from "../../stores/sceneStore";

interface ViewerProps {
  stageSize: StageSize;
  vehicle: Vehicle;
  stageRef: React.RefObject<Konva.Stage>;
}

const Viewer: React.FC<ViewerProps> = ({ stageSize, vehicle, stageRef }) => {
  const stageCenter = {
    x: stageSize.width / 2,
    y: stageSize.height / 2,
  };
  const layerRef = useRef<Konva.Layer>(null);
  const [layerSize, setLayerSize] = useState({ width: 0, height: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [girdMargin] = useState(10000);
  const [contextMenuPos, setContextMenuPos] = useState<null | {
    mouseX: number;
    mouseY: number;
  }>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // 从 SceneStore 获取状态和操作
  const {
    scale,
    stagePos,
    rotation,
    selectedSensor,
    showSensorInfo,
    floatingWindowPos,
    setScale,
    setStagePos,
    setRotation,
    setSelectedSensor,
    setShowSensorInfo,
    setFloatingWindowPos,
    sensors,
  } = useSceneStore();

  const sensorConfiguration = useSensorStore(
    (state: SensorStoreState) => state.sensorConfiguration
  );
  const { ussZoneConfig, layerVisibility } = useGlobalConfigStore();

  useEffect(() => {
    if (layerRef.current) {
      const layer = layerRef.current;
      const width = layer.width();
      const height = layer.height();
      setLayerSize({ width, height });
    }
  }, []);

  // 添加初始化 stagePos 的 useEffect
  useEffect(() => {
    setStagePos(stageCenter);
  }, [stageSize]); // 当 stageSize 改变时重新计算中心位置

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

    const oldScale = scale;
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

    setScale(newScale);
    setStagePos(newPos);
  };

  const handleAutoZoomToSensorCoverage = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const bbox = getSensorCoverageBoundingBox(sensors);

    const scaleX = stageSize.width / bbox.width;
    const scaleY = stageSize.height / bbox.height;
    const newScale = Math.min(scaleX, scaleY) * 0.95;
    setScale(newScale);
    setStagePos(stageCenter);

    handleCloseContextMenu();
  };

  const handleAutoZoom = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const bbox = getBoundingBox(vehicle);

    const scaleX = stageSize.width / bbox.width;
    const scaleY = stageSize.height / bbox.height;
    const newScale = Math.min(scaleX, scaleY) * 0.9;

    setScale(newScale);
    setStagePos(stageCenter);

    handleCloseContextMenu();
  };

  const handleReset = () => {
    setScale(1);
    setStagePos(stageCenter);
    handleCloseContextMenu();
  };

  const handleRotateClockwise = () => {
    const stage = stageRef.current;
    if (!stage) return;
    setRotation(rotation + 90);
    handleCloseContextMenu();
  };

  const handleCenter = () => {
    const stage = stageRef.current;
    if (!stage) return;
    setStagePos(stageCenter);
    handleCloseContextMenu();
  };

  const handleDragMove = (e: any) => {
    setStagePos({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

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
  ): void => {
    setSelectedSensor(sensor);
    setFloatingWindowPos({
      x: event.evt.clientX + 20,
      y: event.evt.clientY + 20,
    });
    setShowSensorInfo(true);
  };

  const handleCloseSensorInfo = () => {
    setShowSensorInfo(false);
    setSelectedSensor(null);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderDebugInfo = () => {
    if (!layerVisibility.showDebugMode) return null;

    const selectedSensorInfo = selectedSensor;

    return (
      <Text
        x={100}
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
      sx={{ width: "100vw", height: "100vh", margin: "auto" }}
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
          <HamburgerMenu />
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
              {layerVisibility.showDebugMode && renderDebugOverlay(stageSize)}
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
              {layerVisibility.showGrid && renderGrid(stageSize, girdMargin)}
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
            >
              {layerVisibility.showDebugMode &&
                renderBoundingBox(sensorConfiguration)}
              {layerVisibility.showDebugMode && renderLayerBoundary(layerSize)}

              <Group>
                <UssZones
                  show={layerVisibility.showUssZones}
                  x={0}
                  y={0}
                  carWidth={vehicle.width}
                  carLength={vehicle.length}
                  frontOverhang={vehicle.frontOverhang}
                  rearOverhang={vehicle.rearOverhang}
                  frontZones={ussZoneConfig.frontZones}
                  rearZones={ussZoneConfig.rearZones}
                  sideZones={ussZoneConfig.sideZones}
                />
                <CarImage
                  show={layerVisibility.showCarImage}
                  x={0}
                  y={0}
                  width={vehicle.width}
                  height={vehicle.length}
                  image={vehicle.image}
                />
                {layerVisibility.showVehicleRefPoint &&
                  Object.entries(vehicle.refPoints).map(
                    ([name, position], index) => {
                      // 计算相对于车辆中心的位置
                      const relativeX = position.x - vehicle.origin.x;
                      const relativeY = position.y - vehicle.origin.y;
                      return (
                        <Group key={index}>
                          <Marker
                            position={{ x: relativeX, y: relativeY }}
                            fill="red"
                          />
                          <Text
                            x={relativeX + 10}
                            y={relativeY - 10}
                            text={name}
                            fontSize={12}
                            fill="red"
                          />
                        </Group>
                      );
                    }
                  )}
                {layerVisibility.showMountingPoints &&
                  Object.entries(vehicle._mountingPoints).map(
                    ([name, point], index) => {
                      if (!point || !point.position) return null;
                      // 计算相对于车辆中心的位置
                      const relativeX = point.position.x - vehicle.origin.x;
                      const relativeY = point.position.y - vehicle.origin.y;
                      return (
                        <Group key={`mount-${index}`}>
                          <Marker
                            position={{ x: relativeX, y: relativeY }}
                            fill="blue"
                          />
                          <Text
                            x={relativeX + 10}
                            y={relativeY - 10}
                            text={name}
                            fontSize={12}
                            fill="blue"
                            fontStyle="bold"
                          />
                          {/* 渲染方向指示器 */}
                          <Group
                            x={relativeX}
                            y={relativeY}
                            rotation={point.orientation}
                          >
                            <Line
                              points={[0, 0, 30, 0]}
                              stroke="blue"
                              strokeWidth={2}
                            />
                            <Line
                              points={[30, 0, 25, -5, 30, 0, 25, 5]}
                              stroke="blue"
                              strokeWidth={2}
                            />
                          </Group>
                        </Group>
                      );
                    }
                  )}
                {/* 渲染传感器 */}
                {sensors.map((sensor) => {
                  const showSensor =
                    (sensor.sensorInfo.type.toLowerCase() === "uss" &&
                      layerVisibility.showUssSensors) ||
                    (sensor.sensorInfo.type.toLowerCase() === "lidar" &&
                      layerVisibility.showLidarSensors) ||
                    (sensor.sensorInfo.type.toLowerCase() === "radar" &&
                      layerVisibility.showRadarSensors) ||
                    (sensor.sensorInfo.type.toLowerCase() === "camera" &&
                      layerVisibility.showCameraSensors);

                  if (!showSensor) return null;

                  // 从vehicle._mountingPoints中获取实际的挂载点信息
                  const mountPoint =
                    vehicle._mountingPoints[sensor.mountPosition.name];
                  if (!mountPoint?.position) return null;

                  // 计算相对于车辆中心的位置
                  const relativeX = isNaN(
                    mountPoint.position.x - vehicle.origin.x
                  )
                    ? 0
                    : mountPoint.position.x - vehicle.origin.x;
                  const relativeY = isNaN(
                    mountPoint.position.y - vehicle.origin.y
                  )
                    ? 0
                    : mountPoint.position.y - vehicle.origin.y;

                  // 创建包含正确位置信息的传感器对象
                  const adjustedSensor = {
                    ...sensor,
                    mountPosition: {
                      ...sensor.mountPosition,
                      position: {
                        x: relativeX,
                        y: relativeY,
                      },
                      orientation: mountPoint.orientation,
                    },
                  };

                  return (
                    <Group key={`sensor-${sensor.id}`}>
                      {/* 只渲染传感器覆盖区域 */}
                      <SensorBlock
                        sensor={adjustedSensor}
                        onClick={(e) => handleSensorClick(sensor, e)}
                        isSelected={selectedSensor?.id === sensor.id}
                      />
                    </Group>
                  );
                })}
              </Group>
            </Layer>
            <Layer>{renderDebugInfo()}</Layer>
          </Stage>

          {/* 独立的右键菜单 */}
          <ViewerContextMenu
            contextMenuPos={contextMenuPos}
            handleCloseContextMenu={handleCloseContextMenu}
            handleReset={handleReset}
            handleCenter={handleCenter}
            handleAutoZoom={handleAutoZoom}
            handleAutoZoomToSensorCoverage={handleAutoZoomToSensorCoverage}
            handleRotateClockwise={handleRotateClockwise}
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
                border: "2px solid #ccc",
                cursor: "move",
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
                  <DragIndicatorIcon sx={{ marginRight: 1 }} />
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {selectedSensor.sensorInfo.name}
                  </Typography>
                </Box>
                <IconButton size="small" onClick={handleCloseSensorInfo}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
              <Box padding={1}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: 12 }}
                >
                  {selectedSensor.mountPosition.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: 12 }}
                >
                  {selectedSensor.id}
                </Typography>

                {selectedSensor.sensorInfo.image ? (
                  <CardMedia
                    component="img"
                    height="140"
                    image={selectedSensor.sensorInfo.image}
                    alt={selectedSensor.sensorInfo.name}
                    sx={{ objectFit: "contain", marginBottom: "16px" }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: "140px",
                      minWidth: "360",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#f0f0f0",
                      marginBottom: "16px",
                    }}
                  ></Box>
                )}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {selectedSensor.sensorInfo.desc}
                </Typography>

                {selectedSensor.sensorInfo.spec && (
                  <Table size="small" aria-label="sensor specs">
                    <TableBody>
                      {Object.entries(selectedSensor.sensorInfo.spec).map(
                        ([key, value]) => (
                          <TableRow key={key}>
                            <TableCell component="th" scope="row">
                              {key}
                            </TableCell>
                            <TableCell>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "50px",
                                  color: "black",
                                  textAlign: "center",
                                }}
                              >
                                {value}
                              </span>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                )}
              </Box>
            </Paper>
          </Draggable>
        )}
      </Grid>
    </Grid>
  );
};

export default Viewer;
