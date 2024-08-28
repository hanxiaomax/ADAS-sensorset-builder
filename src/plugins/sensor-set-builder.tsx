import React, { useState, useEffect } from "react";
import { Grid, Box, AppBar, ButtonGroup, Typography } from "@mui/material";
import { Stage, Layer, Rect } from "react-konva";
import CarImage from "../components/carImage";
import UssZones from "../components/UssZones";
import { Sensor } from "../components/Sensors";
import ControlPanel from "../components/ControlPanel";
import useImage from "use-image";
import { Position, SensorConfig } from "../types/Common";
import { Vehicle } from "../types/Vehicle";
import { transformJsonArray } from "../parser";
import BottomDrawer from "../components/BottomDrawer";
import ViewMenu from "../components/ViewMenu";
import ProfileMenu from "../components/ProfileMenu";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface MarkerProps {
  position: Position;
  fill?: string;
}

const Marker: React.FC<MarkerProps> = ({ position, fill = "black" }) => {
  const offset = 5;
  return (
    <Rect
      x={position.x - offset}
      y={position.y - offset}
      width={10}
      height={10}
      fill={fill}
    />
  );
};

const SensorSetBuilderMain: React.FC = () => {
  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // 添加用于存储导入的 JSON 文件内容的状态
  const [sensorConfiguration, setSensorConfiguration] = useState<
    SensorConfig[]
  >([]);
  const [sensorData, setSensorData] = useState<any>(null);

  const [uiConfig, setUiConfig] = useState({
    showCarImage: true,
    showUssZones: false,
    showUssSensors: true,
    showLidarSensors: true,
    showRadarSensors: true,
    showCameraSensors: true,
    showVehicleRefPoint: false,
    showNerdMode: false,
    frontZones: 6,
    rearZones: 4,
    sideZones: 6,
    panelVisible: false,
    background: "white",
  });

  const [image] = useImage("/vehicle.png");
  const vehicle = new Vehicle(stageSize, image);

  useEffect(() => {
    const handleResize = () => {
      setStageSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleImport = (type: "sensorConfig" | "sensorData", data: any) => {
    if (type === "sensorConfig") {
      const transformedData = transformJsonArray(data, vehicle._mountingPoints);
      setSensorConfiguration(transformedData);
    } else if (type === "sensorData") {
      setSensorData(data);
    }
  };

  const handleExport = () => {
    console.log("Export clicked");
    // 实现导出功能的逻辑
  };

  return (
    <Grid
      container
      alignItems="center"
      sx={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: uiConfig.background,
      }}
    >
      <AppBar
        position="static"
        elevation={1}
        sx={{
          backgroundColor: "#f8f8f8",
          color: "black",
        }}
      >
        <ButtonGroup
          disableElevation
          variant="outlined"
          size="small"
          sx={{
            "& .MuiButtonBase-root": {
              backgroundColor: "#ebebeb",
              borderColor: "#f6f6f6",
              borderRightColor: "#d1d1d1",
              borderLeftColor: "#d1d1d1",
              color: "black",
              borderRadius: 0,
              "&:hover": {
                backgroundColor: "#f6f6f6",
              },
            },
          }}
        >
          <ProfileMenu onImport={handleImport} onExport={handleExport} />
          <ViewMenu uiConfig={uiConfig} setUiConfig={setUiConfig} />
        </ButtonGroup>
      </AppBar>

      <Grid item xs={12}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            width: "100%",
            height: "100%",
            transform: "scale(0.8)",
            zIndex: 1000,
          }}
        >
          <Stage width={stageSize.width} height={stageSize.height}>
            {uiConfig.showCarImage && (
              <CarImage
                x={vehicle.origin.x}
                y={vehicle.origin.y}
                width={vehicle.width}
                height={vehicle.length}
                image={vehicle.image}
              />
            )}
            {uiConfig.showUssZones && (
              <UssZones
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
            )}

            <Layer>
              {uiConfig.showVehicleRefPoint &&
                Object.values(vehicle.refPoints).map((position, index) => (
                  <Marker key={index} position={position} fill="red" />
                ))}

              {uiConfig.showUssSensors &&
                sensorConfiguration
                  .filter((sensor) => sensor.type === "uss")
                  .map((sensorConfig, index) => (
                    <Sensor
                      key={index}
                      type={sensorConfig.type}
                      mountPosition={sensorConfig.mountPosition}
                      fov={sensorConfig.fov}
                      range={sensorConfig.range}
                      uiConfig={uiConfig}
                    />
                  ))}
              {uiConfig.showLidarSensors &&
                sensorConfiguration
                  .filter((sensor) => sensor.type === "lidar")
                  .map((sensorConfig, index) => (
                    <Sensor
                      key={index}
                      type={sensorConfig.type}
                      mountPosition={sensorConfig.mountPosition}
                      fov={sensorConfig.fov}
                      range={sensorConfig.range}
                      uiConfig={uiConfig}
                    />
                  ))}
              {uiConfig.showRadarSensors &&
                sensorConfiguration
                  .filter((sensor) => sensor.type === "radar")
                  .map((sensorConfig, index) => (
                    <Sensor
                      key={index}
                      type={sensorConfig.type}
                      mountPosition={sensorConfig.mountPosition}
                      fov={sensorConfig.fov}
                      range={sensorConfig.range}
                      uiConfig={uiConfig}
                    />
                  ))}
              {uiConfig.showCameraSensors &&
                sensorConfiguration
                  .filter((sensor) => sensor.type === "camera")
                  .map((sensorConfig, index) => (
                    <Sensor
                      key={index}
                      type={sensorConfig.type}
                      mountPosition={sensorConfig.mountPosition}
                      fov={sensorConfig.fov}
                      range={sensorConfig.range}
                      uiConfig={uiConfig}
                    />
                  ))}
            </Layer>
          </Stage>
        </Box>
      </Grid>

      {/* <BottomDrawer /> */}

      {uiConfig.showNerdMode && (
        <Box
          sx={{
            position: "fixed",
            top: 40,
            right: 0,
            width: "20vw",
            height: "95vh",
            padding: "5px",
            overflowY: "auto",
            zIndex: 1500,
          }}
        >
          <Accordion>
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography sx={{ fontSize: "0.875rem" }}>
                Sensor Configuration
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                gutterBottom
                sx={{
                  fontSize: "0.7rem",
                  color: "black",
                }}
              >
                <pre style={{ whiteSpace: "pre-wrap" }}>
                  {JSON.stringify(sensorConfiguration, null, 2)}
                </pre>
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography sx={{ fontSize: "0.875rem" }}>
                Sensor Stocks
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                gutterBottom
                sx={{
                  fontSize: "0.7rem",
                  color: "black",
                }}
              >
                <pre style={{ whiteSpace: "pre-wrap" }}>
                  {JSON.stringify(sensorData, null, 2)}
                </pre>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Grid>
  );
};

export default SensorSetBuilderMain;
