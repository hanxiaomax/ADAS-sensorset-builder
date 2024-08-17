import React, { useState } from "react";
import { Grid, Box, IconButton, TextField } from "@mui/material";
import { Stage } from "react-konva";
import CarImage from "../components/carImage";
import UssZones from "../components/UssZones";
import UssSensors from "../components/UssSensors";
import ControlPanel from "../components/ControlPanel";
import SettingsIcon from "@mui/icons-material/Settings";
import useImage from "use-image";

interface SensorConfig {
  x: number;
  y: number;
  orientation: number;
  fov: number;
}

const SensorSetBuilderMain: React.FC = () => {
  const [frontZones, setFrontZones] = useState<number>(6);
  const [rearZones, setRearZones] = useState<number>(4);
  const [sideZones, setSideZones] = useState<number>(6);

  const [showUssZones, setShowUssZones] = useState<boolean>(true);
  const [showCarImage, setShowCarImage] = useState<boolean>(true);
  const [showUssSensors, setShowUssSensors] = useState<boolean>(true);

  const [sensorSize, setSensorSize] = useState<number>(10); // 传感器大小

  // 传感器配置数组
  const [sensors, setSensors] = useState<SensorConfig[]>([
    { x: 150, y: 50, orientation: 270, fov: 120 },
    { x: 250, y: 50, orientation: 270, fov: 120 },
    { x: 350, y: 50, orientation: 270, fov: 120 },
    { x: 150, y: 350, orientation: 90, fov: 120 },
    { x: 250, y: 350, orientation: 90, fov: 120 },
    { x: 350, y: 350, orientation: 90, fov: 120 },
  ]);

  const [panelVisible, setPanelVisible] = useState<boolean>(false);

  const [image] = useImage("/vehicle.png");
  const image_margin = 20;
  const overhang = 60 + image_margin;
  const frontOverhang = overhang / 2;
  const rearOverhang = overhang / 2;
  const carWidth = image?.width!;
  const carLength = image?.height!;

  const stage_size = { width: 400, height: 800 };
  const origin = {
    x: (stage_size.width - carLength) / 2,
    y: (stage_size.height - carLength) / 2,
  };

  // 构建图层控制项数组
  const layers = [
    {
      name: "USS 区域",
      visible: showUssZones,
      toggleVisibility: () => setShowUssZones(!showUssZones),
      controls: (
        <Box>
          <TextField
            label="Front Zones Numbers"
            type="number"
            variant="outlined"
            value={frontZones}
            onChange={(e) => setFrontZones(parseInt(e.target.value))}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Side Zone Numbers"
            type="number"
            variant="outlined"
            value={sideZones}
            onChange={(e) => setSideZones(parseInt(e.target.value))}
            margin="normal"
            fullWidth
          />
          <TextField
            label="Rear Zones Numbers"
            type="number"
            variant="outlined"
            value={rearZones}
            onChange={(e) => setRearZones(parseInt(e.target.value))}
            margin="normal"
            fullWidth
          />
        </Box>
      ),
    },
    {
      name: "车辆图像",
      visible: showCarImage,
      toggleVisibility: () => setShowCarImage(!showCarImage),
      controls: null,
    },
    {
      name: "超声波传感器",
      visible: showUssSensors,
      toggleVisibility: () => setShowUssSensors(!showUssSensors),
      controls: (
        <Box>
          <TextField
            label="传感器大小"
            type="number"
            variant="outlined"
            value={sensorSize}
            onChange={(e) => setSensorSize(parseInt(e.target.value))}
            margin="normal"
            fullWidth
          />
          {/* 可以添加更多传感器的控制，比如配置每个传感器的位置和角度 */}
        </Box>
      ),
    },
  ];

  return (
    <Grid
      container
      spacing={2}
      style={{ height: "100vh", alignItems: "center" }}
    >
      <Grid item xs={10}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: "rotate(270deg)",
          }}
        >
          <Stage width={stage_size.width} height={stage_size.height}>
            {showUssZones && (
              <UssZones
                x={origin.x}
                y={origin.y}
                carWidth={carWidth}
                carLength={carLength}
                frontOverhang={frontOverhang}
                rearOverhang={rearOverhang}
                frontZones={frontZones}
                rearZones={rearZones}
                sideZones={sideZones}
              />
            )}
            {showCarImage && (
              <CarImage
                x={origin.x}
                y={origin.y}
                width={carWidth}
                height={carLength}
                imageSrc="/vehicle.png"
              />
            )}
            {showUssSensors && (
              <UssSensors
                sensors={sensors || []} // 确保传递的数组已初始化
                sensorSize={sensorSize}
              />
            )}
          </Stage>
        </Box>
      </Grid>

      {panelVisible && (
        <ControlPanel layers={layers} onClose={() => setPanelVisible(false)} />
      )}

      {!panelVisible && (
        <IconButton
          onClick={() => setPanelVisible(true)}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
          }}
        >
          <SettingsIcon />
        </IconButton>
      )}
    </Grid>
  );
};

export default SensorSetBuilderMain;
