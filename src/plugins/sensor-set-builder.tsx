import React, { useState } from "react";
import { Grid, TextField, Box, Button, Typography } from "@mui/material";
import { Stage } from "react-konva";
import CarImage from "../components/carImage";
import UssZones from "../components/UssZones";
import UssSensors from "../components/UssSensors";
import useImage from "use-image";

const SensorSetBuilderMain: React.FC = () => {
  const [frontZones, setFrontZones] = useState<number>(6);
  const [rearZones, setRearZones] = useState<number>(4);
  const [sideZones, setSideZones] = useState<number>(6);

  // 控制图层可见性的状态
  const [showUssZones, setShowUssZones] = useState<boolean>(true);
  const [showCarImage, setShowCarImage] = useState<boolean>(true);
  const [showUssSensors, setShowUssSensors] = useState<boolean>(true);

  const [image] = useImage("/vehicle.png");
  const image_margin = 20;
  const overhang = 60 + image_margin; // assuming equal front real overhang
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
      <Grid item xs={2}></Grid>
      <Grid item xs={6}>
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

      <Grid item xs={4}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="center"
          height="100%"
          padding={2}
        >
          <TextField
            label="Front Zones Numbers"
            type="number"
            variant="outlined"
            value={frontZones}
            onChange={(e) => setFrontZones(parseInt(e.target.value))}
            margin="normal"
            style={{ maxWidth: "300px" }}
          />
          <TextField
            label="Side Zone Numbers"
            type="number"
            variant="outlined"
            value={sideZones}
            onChange={(e) => setSideZones(parseInt(e.target.value))}
            margin="normal"
            style={{ maxWidth: "300px" }}
          />
          <TextField
            label="Rear Zones Numbers"
            type="number"
            variant="outlined"
            value={rearZones}
            onChange={(e) => setRearZones(parseInt(e.target.value))}
            margin="normal"
            style={{ maxWidth: "300px" }}
          />

          {/* 图层控制区 */}
          <Box
            position="absolute"
            top={16}
            right={16}
            display="flex"
            flexDirection="column"
            bgcolor="white"
            padding={2}
            borderRadius={4}
            boxShadow={3}
          >
            <Typography variant="h6">图层控制</Typography>
            <Button
              variant="contained"
              color={showUssZones ? "primary" : "inherit"}
              onClick={() => setShowUssZones(!showUssZones)}
              style={{ marginBottom: "8px" }}
            >
              {showUssZones ? "隐藏" : "显示"} USS 区域
            </Button>
            <Button
              variant="contained"
              color={showCarImage ? "primary" : "inherit"}
              onClick={() => setShowCarImage(!showCarImage)}
              style={{ marginBottom: "8px" }}
            >
              {showCarImage ? "隐藏" : "显示"} 车辆图像
            </Button>
            <Button
              variant="contained"
              color={showUssSensors ? "primary" : "inherit"}
              onClick={() => setShowUssSensors(!showUssSensors)}
            >
              {showUssSensors ? "隐藏" : "显示"} 超声波传感器
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SensorSetBuilderMain;
