import React, { useState } from "react";
import {
  Grid,
  Box,
  Menu,
  MenuItem,
  ListItemText,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Stage, Layer, Line } from "react-konva";
import CarImage from "./carImage";
import UssZones from "./UssZones";
import { SensorBlock } from "./Sensors";
import Marker, { mountStringToPosition } from "./utils";
import { MountPosition, Sensor, SENSOR_RANGE_FACTOR } from "../types/Common";
import { Vehicle } from "../types/Vehicle";
import Konva from "konva";
import {
  CenterFocusWeak,
  DirectionsCarFilled,
  RestartAlt,
  Sensors,
  GridOn,
} from "@mui/icons-material";

interface ViewerProps {
  stageSize: { width: number; height: number };
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
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null); // 新增状态：存储被选中的传感器ID

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
    getSensorCoverageBoundingBox();
  };

  const handleToggleGrid = () => {
    setUiConfig((prev: any) => ({
      ...prev,
      showGrid: !prev.showGrid,
    }));
  };

  const renderGrid = () => {
    const gridSize = 50;
    const lines = [];
    for (let i = -girdMargin; i < stageSize.width + girdMargin; i += gridSize) {
      lines.push(
        <Line
          key={`v-${i}`}
          points={[i, -girdMargin, i, stageSize.height + girdMargin]}
          stroke="#989898"
          strokeWidth={0.5}
        />
      );
    }

    for (
      let i = -girdMargin;
      i < stageSize.height + girdMargin;
      i += gridSize
    ) {
      lines.push(
        <Line
          key={`h-${i}`}
          points={[-girdMargin, i, stageSize.width + girdMargin, i]}
          stroke="#989898"
          strokeWidth={0.5}
        />
      );
    }

    return lines;
  };

  // 计算传感器的覆盖范围的边界框
  const getSensorCoverageBoundingBox = () => {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    sensorConfiguration.forEach((sensor) => {
      const mount_position = mountStringToPosition(
        sensor.mountPosition!.name
      ) as MountPosition;

      const sensorX = mount_position.position!.x;
      const sensorY = mount_position.position!.y;
      const sensorRange =
        sensor.sensorInfo.spec?.range * SENSOR_RANGE_FACTOR || 0;

      const sensorMinX = sensorX - sensorRange;
      const sensorMinY = sensorY - sensorRange;
      const sensorMaxX = sensorX + sensorRange;
      const sensorMaxY = sensorY + sensorRange;

      if (sensorMinX < minX) minX = sensorMinX;
      if (sensorMinY < minY) minY = sensorMinY;
      if (sensorMaxX > maxX) maxX = sensorMaxX;
      if (sensorMaxY > maxY) maxY = sensorMaxY;
    });
    setGirdMargin(Math.max(maxX, maxY) * 5);
    return { minX, minY, maxX, maxY };
  };

  const handleAutoZoomToSensorCoverage = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const { minX, minY, maxX, maxY } = getSensorCoverageBoundingBox();
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
      setSelectedSensor(null); // 如果再次点击相同传感器，则取消选中
    } else {
      setSelectedSensor(sensorId); // 选中新的传感器
    }
  };

  // 计算车辆和传感器的边界框
  const getBoundingBox = () => {
    let minX = vehicle.origin.x;
    let minY = vehicle.origin.y;
    let maxX = vehicle.origin.x + vehicle.width;
    let maxY = vehicle.origin.y + vehicle.length;

    sensorConfiguration.forEach((sensor) => {
      const mount_position = mountStringToPosition(
        sensor.mountPosition!.name
      ) as MountPosition;

      const sensorX = mount_position.position!.x;
      const sensorY = mount_position.position!.y;

      // 更新最小和最大坐标
      if (sensorX < minX) minX = sensorX;
      if (sensorY < minY) minY = sensorY;
      if (sensorX > maxX) maxX = sensorX;
      if (sensorY > maxY) maxY = sensorY;
    });

    return { minX, minY, maxX, maxY };
  };

  // 自动缩放到适合的大小
  const handleAutoZoom = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const { minX, minY, maxX, maxY } = getBoundingBox();
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
          >
            {/* 固定网格层 */}
            <Layer listening={false} scaleX={1} scaleY={1} x={0} y={0}>
              {uiConfig.showGrid && renderGrid()}
            </Layer>

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
                <SensorBlock
                  key={index}
                  sensor={sensor}
                  uiConfig={uiConfig}
                  onClick={() => handleSensorClick(sensor.id)} // 添加点击事件
                  isSelected={selectedSensor === sensor.id} // 判断是否高亮
                />
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
          </Menu>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Viewer;
