import React, { useState } from "react";
import { Grid, Box, IconButton, TextField } from "@mui/material";
import { Stage } from "react-konva";
import CarImage from "../components/carImage";
import UssZones from "../components/UssZones";
import UssSensors from "../components/UssSensors";
import ControlPanel from "../components/ControlPanel";
import SettingsIcon from "@mui/icons-material/Settings";
import useImage from "use-image";

const SensorSetBuilderMain: React.FC = () => {
  const [frontZones, setFrontZones] = useState<number>(6);
  const [rearZones, setRearZones] = useState<number>(4);
  const [sideZones, setSideZones] = useState<number>(6);

  const [showUssZones, setShowUssZones] = useState<boolean>(true);
  const [showCarImage, setShowCarImage] = useState<boolean>(true);
  const [showUssSensors, setShowUssSensors] = useState<boolean>(true);

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
      controls: null, // 当前没有需要设置的参数
    },
    {
      name: "超声波传感器",
      visible: showUssSensors,
      toggleVisibility: () => setShowUssSensors(!showUssSensors),
      controls: null, // 当前没有需要设置的参数
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
                x={origin.x}
                y={origin.y}
                carWidth={carWidth}
                carLength={carLength}
              />
            )}
          </Stage>
        </Box>
      </Grid>

      {panelVisible && (
        <ControlPanel
          layers={layers} // 传递图层控制项
          onClose={() => setPanelVisible(false)}
        />
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
