import React, { useState } from "react";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import SensorsOutlinedIcon from "@mui/icons-material/SensorsOutlined";
import RadarOutlinedIcon from "@mui/icons-material/RadarOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import ToysOutlinedIcon from "@mui/icons-material/ToysOutlined";
import SensorStockItem from "../SensorStock";
import CreateSensorDialog from "../Dialogs/CreateSensorDialog";
import { SensorItem, SensorStocks } from "../../types/Common";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import { HtmlTooltip } from "../ToolTips";
import { useSensorStore } from "../../stores/sensorStore";

interface SensorStackPanelProps {}

const SensorStackPanel: React.FC<SensorStackPanelProps> = ({}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const sensorTypes = ["USS", "Lidar", "Radar", "Camera"];
  const [selectedType, setSelectedType] = useState("USS");
  const {
    sensorConfiguration,
    setSensorConfiguration,
    sensorStocks,
    setSensorStocks,
  } = useSensorStore();
  const categorizedSensors: { [key: string]: SensorItem[] } =
    sensorTypes.reduce((acc, type) => {
      acc[type.toLowerCase()] = Object.values(sensorStocks).filter(
        (sensor) => sensor.type === type.toLowerCase()
      );
      return acc;
    }, {} as { [key: string]: SensorItem[] });

  const handleEdit = (editedSensor: SensorItem) => {
    const updatedSensorStocks = {
      ...sensorStocks,
      [editedSensor.id]: editedSensor,
    };
    setSensorStocks(updatedSensorStocks);
    localStorage.setItem("sensorStocks", JSON.stringify(updatedSensorStocks));
  };

  const handleDialogOpen = (type: string) => {
    setDialogOpen(true);
    setSelectedType(type);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleCreateSensor = (newSensor: SensorItem) => {
    if (!sensorStocks) return;

    // 合并新旧传感器配置
    const updatedSensorStocks = {
      ...sensorStocks,
      [newSensor.id]: {
        ...newSensor,
        configuration: {
          ...(sensorStocks[newSensor.id]?.configuration || {}),
          ...newSensor.configuration,
        },
      },
    };

    setSensorStocks(updatedSensorStocks);
    localStorage.setItem("sensorStocks", JSON.stringify(updatedSensorStocks));
    handleDialogClose();
  };

  const handleDelete = (id: string) => {
    if (!sensorStocks) return;

    const { [id]: _, ...remainingSensors } = sensorStocks;
    setSensorStocks(remainingSensors);
    localStorage.setItem("sensorStocks", JSON.stringify(remainingSensors));
  };

  const renderSensors = (type: string) => {
    return categorizedSensors[type.toLowerCase()].map((sensor) => {
      let icon;
      switch (sensor.type) {
        case "uss":
          icon = <SensorsOutlinedIcon sx={{ fontSize: "40px" }} />;
          break;
        case "lidar":
          icon = <ToysOutlinedIcon sx={{ fontSize: "40px" }} />;
          break;
        case "radar":
          icon = <RadarOutlinedIcon sx={{ fontSize: "40px" }} />;
          break;
        case "camera":
          icon = <CameraAltOutlinedIcon sx={{ fontSize: "40px" }} />;
          break;
        default:
          icon = <SensorsOutlinedIcon sx={{ fontSize: "40px" }} />;
      }

      return (
        <SensorStockItem
          key={sensor.id}
          icon={icon}
          sensor={sensor}
          onEdit={handleEdit}
          onDelete={() => handleDelete(sensor.id)}
        />
      );
    });
  };

  return (
    <>
      {sensorTypes.map((type, index) => (
        <Box key={index}>
          <Box sx={{ fontSize: "16px", marginBottom: "4px" }}>{type}</Box>
          <Divider sx={{ flexGrow: 1 }} />
          <Box display="flex" flexWrap="wrap">
            {renderSensors(type)}
            <Box onClick={() => handleDialogOpen(type)}>
              <HtmlTooltip
                title={
                  <React.Fragment>
                    <Typography color="inherit">
                      Create new <u>{type}</u> sensor
                    </Typography>
                  </React.Fragment>
                }
              >
                <IconButton>
                  <AddTwoToneIcon sx={{ fontSize: "40px" }} />
                </IconButton>
              </HtmlTooltip>
            </Box>
          </Box>
        </Box>
      ))}
      <CreateSensorDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onCreate={handleCreateSensor}
        existingTypes={Object.values(sensorTypes || {})}
        defaultType={selectedType}
      />
    </>
  );
};

export default SensorStackPanel;
