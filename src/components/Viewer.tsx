import React, { useState } from "react";
import { Grid, Box } from "@mui/material";
import { Stage, Layer, Rect, Line } from "react-konva"; // 使用 react-konva 提供的 Stage
import CarImage from "./carImage";
import UssZones from "./UssZones";
import { SensorBlock } from "./Sensors";
import Marker from "./utils";
import { Sensor } from "../types/Common";
import { Vehicle } from "../types/Vehicle";
import Konva from "konva"; // 引入 Konva
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import RefreshIcon from "@mui/icons-material/Refresh";
import { IconButton } from "@mui/material";

interface ViewerProps {
  stageSize: { width: number; height: number };
  vehicle: Vehicle;
  sensorConfiguration: Sensor[];
  uiConfig: any;
  stageRef: React.RefObject<Konva.Stage>; // 修正类型为 react-konva 提供的 Stage
}

const Viewer: React.FC<ViewerProps> = ({
  stageSize,
  vehicle,
  sensorConfiguration,
  uiConfig,
  stageRef,
}) => {
  const [scale, setScale] = useState(1); // 控制缩放比例

  // 添加网格背景，只绘制中间 8 列的区域
  const renderGrid = () => {
    const gridSize = 20;
    const totalWidth = stageSize.width;
    const totalHeight = stageSize.height;

    // 计算中间 8 列的宽度范围 (xs={8} 代表 8/12)
    const middleWidthStart = (totalWidth / 12) * 2; // 左侧 2 列的宽度
    const middleWidthEnd = (totalWidth / 12) * 10; // 右侧 2 列的宽度

    const lines = [];

    // 绘制垂直线（仅在中间 8 列范围内绘制）
    for (let i = middleWidthStart; i < middleWidthEnd; i += gridSize) {
      lines.push(
        <Line
          key={`v-${i}`}
          points={[i, 0, i, totalHeight]}
          stroke="#ddd"
          strokeWidth={1}
        />
      );
    }

    // 绘制水平线（全宽度绘制）
    for (let i = 0; i < totalHeight; i += gridSize) {
      lines.push(
        <Line
          key={`h-${i}`}
          points={[middleWidthStart, i, middleWidthEnd, i]}
          stroke="#ddd"
          strokeWidth={1}
        />
      );
    }

    return lines;
  };

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
  };

  const handleReset = () => {
    setScale(1);
  };

  return (
    <Grid
      container
      sx={{ width: "80vw", height: "100vh", margin: "auto", mt: 4, mb: 2 }}
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
            position: "relative", // 为工具栏提供定位支持
          }}
        >
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            ref={stageRef}
            scaleX={scale}
            scaleY={scale}
          >
            {/* 绘制网格背景 */}
            <Layer>{renderGrid()}</Layer>

            {/* 车辆和传感器区域 */}
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

          {/* 右侧工具栏 */}
          <Box
            sx={{
              position: "absolute",
              top: 20,
              right: 20,
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#f5f5f5",
              padding: 2,
              borderRadius: 1,
              boxShadow: "0 0 5px rgba(0,0,0,0.3)",
            }}
          >
            <IconButton onClick={handleZoomIn} sx={{ mb: 1 }}>
              <ZoomInIcon fontSize="large" />
            </IconButton>
            <IconButton onClick={handleZoomOut} sx={{ mb: 1 }}>
              <ZoomOutIcon fontSize="large" />
            </IconButton>
            <IconButton onClick={handleReset}>
              <RefreshIcon fontSize="large" />
            </IconButton>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Viewer;
