import React, { useState } from "react";
import { Grid, Box, IconButton } from "@mui/material";
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

  const [panelVisible, setPanelVisible] = useState<boolean>(false); // 初始状态为隐藏控制面板

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
          showUssZones={showUssZones}
          showCarImage={showCarImage}
          showUssSensors={showUssSensors}
          setShowUssZones={setShowUssZones}
          setShowCarImage={setShowCarImage}
          setShowUssSensors={setShowUssSensors}
          frontZones={frontZones}
          sideZones={sideZones}
          rearZones={rearZones}
          setFrontZones={setFrontZones}
          setSideZones={setSideZones}
          setRearZones={setRearZones}
          onClose={() => setPanelVisible(false)} // 传递关闭回调函数
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
