import React, { useState } from "react";
import { Grid, Box } from "@mui/material";
import { Stage, Layer, Line } from "react-konva"; // 使用 react-konva 提供的 Stage
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
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 }); // 舞台位置，用于拖动

  // 添加固定网格背景，不随缩放变化

  const handleZoom = (zoomFactor: number) => {
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const newScale = oldScale * zoomFactor;
    const stageCenter = {
      x: stage.width() / 2,
      y: stage.height() / 2,
    };

    const mousePointTo = {
      x: (stageCenter.x - stage.x()) / oldScale,
      y: (stageCenter.y - stage.y()) / oldScale,
    };

    const newPos = {
      x: stageCenter.x - mousePointTo.x * newScale,
      y: stageCenter.y - mousePointTo.y * newScale,
    };

    setScale(newScale);
    setStagePos(newPos);
  };

  const handleZoomIn = () => {
    handleZoom(1.2); // 放大 1.2 倍
  };

  const handleZoomOut = () => {
    handleZoom(0.8); // 缩小到 0.8 倍
  };

  const handleReset = () => {
    setScale(1); // 重置缩放比例
    setStagePos({ x: 0, y: 0 }); // 重置舞台位置
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
            x={stagePos.x}
            y={stagePos.y}
            draggable
            onDragMove={handleDragMove} // 允许拖动
          >
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
              right: 200,
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
